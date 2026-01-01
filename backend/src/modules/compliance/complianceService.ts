import { logger } from '../../logger';
import { ComplianceRiskScore, COMPLIANCE_TIERS, ComplianceTier } from './tiers';

export interface ComplianceStatusSnapshot {
  userId: string;
  tierId: keyof typeof COMPLIANCE_TIERS;
  verificationLevel: 'basic' | 'enhanced' | 'full';
  riskScore: ComplianceRiskScore;
  dailySpent: number;
  monthlySpent: number;
  flags: string[];
}

export interface ComplianceDecisionResult {
  canProceed: boolean;
  blockers: string[];
  warnings: string[];
  riskScore: ComplianceRiskScore;
  tier: ComplianceTier;
  nextTier?: ComplianceTier;
}

export class ComplianceService {
  private statusRegistry = new Map<string, ComplianceStatusSnapshot>();
  private readonly highRiskDestinations = new Set(['RU', 'BY', 'IR', 'KP']);

  async getStatus(userId: string): Promise<ComplianceStatusSnapshot> {
    const existing = this.statusRegistry.get(userId);
    if (existing) return existing;
    const snapshot: ComplianceStatusSnapshot = {
      userId,
      tierId: 'starter',
      verificationLevel: 'basic',
      riskScore: 'low',
      dailySpent: 0,
      monthlySpent: 0,
      flags: [],
    };
    this.statusRegistry.set(userId, snapshot);
    return snapshot;
  }

  async evaluateTransfer(input: {
    userId: string;
    amount: number;
    currency: string;
    destinationCountry?: string;
    tierId?: keyof typeof COMPLIANCE_TIERS;
  }): Promise<ComplianceDecisionResult> {
    const status = await this.getStatus(input.userId);
    const tier = COMPLIANCE_TIERS[input.tierId || status.tierId];
    const riskScore = this.assessTransactionRisk(input.amount, input.destinationCountry);

    const blockers: string[] = [];
    const warnings: string[] = [];

    if (input.amount > tier.singleTransactionLimit) {
      blockers.push(`Amount exceeds single transfer limit (${tier.singleTransactionLimit})`);
    }
    if (status.dailySpent + input.amount > tier.dailyLimit) {
      blockers.push('Daily limit would be exceeded');
    }
    if (status.monthlySpent + input.amount > tier.monthlyLimit) {
      blockers.push('Monthly limit would be exceeded');
    }

    const utilization = (status.monthlySpent + input.amount) / tier.monthlyLimit;
    if (utilization > 0.8 && blockers.length === 0) {
      warnings.push('Approaching monthly limit');
    }

    if (riskScore === 'high') {
      warnings.push('High risk routing — manual review recommended');
    }

    const nextTierId = this.getNextTierId(tier.id);

    const decision: ComplianceDecisionResult = {
      canProceed: blockers.length === 0,
      blockers,
      warnings,
      riskScore,
      tier,
      nextTier: nextTierId !== tier.id ? COMPLIANCE_TIERS[nextTierId] : undefined,
    };

    return decision;
  }

  assessTransactionRisk(amount: number, destinationCountry?: string): ComplianceRiskScore {
    let score: ComplianceRiskScore = 'low';
    if (amount > 1000 && amount <= 3000) score = 'medium';
    if (amount > 3000) score = 'high';
    if (destinationCountry && this.highRiskDestinations.has(destinationCountry.toUpperCase())) {
      score = 'high';
    }
    return score;
  }

  async recordSuccessfulTransfer(userId: string, amount: number) {
    const status = await this.getStatus(userId);
    status.dailySpent += amount;
    status.monthlySpent += amount;
    status.riskScore = this.assessTransactionRisk(amount);
    this.statusRegistry.set(userId, status);
  }

  async resetSpending(userId: string) {
    const status = await this.getStatus(userId);
    status.dailySpent = 0;
    status.monthlySpent = 0;
    this.statusRegistry.set(userId, status);
  }

  async upgradeTier(userId: string, tierId: keyof typeof COMPLIANCE_TIERS) {
    const status = await this.getStatus(userId);
    status.tierId = tierId;
    status.verificationLevel = tierId === 'premium' ? 'full' : 'enhanced';
    this.statusRegistry.set(userId, status);
    logger.info({ userId, tierId }, 'compliance tier upgraded');
  }

  private getNextTierId(current: string): keyof typeof COMPLIANCE_TIERS {
    if (current === 'starter') return 'verified';
    if (current === 'verified') return 'premium';
    return current as keyof typeof COMPLIANCE_TIERS;
  }
}
