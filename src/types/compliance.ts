export interface ComplianceTier {
  id: string;
  name: string;
  dailyLimit: number;
  monthlyLimit: number;
  yearlyLimit: number;
  singleTransactionLimit: number;
  description: string;
  requirements: string[];
  benefits: string[];
  upgradeRequirements?: string[];
}

export interface ComplianceStatus {
  currentTier: string;
  dailySpent: number;
  monthlySpent: number;
  yearlySpent: number;
  dailyRemaining: number;
  monthlyRemaining: number;
  yearlyRemaining: number;
  canUpgrade: boolean;
  nextTier?: ComplianceTier;
  verificationLevel: 'basic' | 'enhanced' | 'full';
  riskScore: 'low' | 'medium' | 'high';
  lastAssessment: Date;
  flags: ComplianceFlag[];
}

export interface ComplianceFlag {
  id: string;
  type: 'info' | 'warning' | 'restriction';
  message: string;
  action?: 'verify_identity' | 'provide_documentation' | 'contact_support';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface ComplianceCheck {
  canProceed: boolean;
  warnings: string[];
  requirements: string[];
  suggestedActions: string[];
  upgradeIncentive?: string;
}

export interface IdentityVerification {
  level: 'basic' | 'enhanced' | 'full';
  documents: {
    governmentId: boolean;
    proofOfAddress: boolean;
    sourceOfFunds: boolean;
    biometric: boolean;
  };
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  completedAt?: Date;
  expiresAt?: Date;
  rejectionReasons?: string[];
}

export interface TransactionRiskAssessment {
  score: number;
  factors: {
    amount: 'low' | 'medium' | 'high';
    frequency: 'low' | 'medium' | 'high';
    destination: 'low' | 'medium' | 'high';
    pattern: 'normal' | 'unusual' | 'suspicious';
  };
  requiresReview: boolean;
  additionalChecks: string[];
}

export const COMPLIANCE_TIERS: Record<string, ComplianceTier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    dailyLimit: 500,
    monthlyLimit: 2000,
    yearlyLimit: 10000,
    singleTransactionLimit: 250,
    description: 'Perfect for getting started with small transfers',
    requirements: ['Valid email or phone', 'Basic profile information'],
    benefits: [
      'Instant transfers up to $250',
      'Access to all destination countries',
      'Real-time tracking',
      'Customer support'
    ],
    upgradeRequirements: ['Government ID verification', 'Proof of address']
  },
  verified: {
    id: 'verified',
    name: 'Verified',
    dailyLimit: 2500,
    monthlyLimit: 10000,
    yearlyLimit: 50000,
    singleTransactionLimit: 1000,
    description: 'Increased limits with identity verification',
    requirements: [
      'Government-issued photo ID',
      'Proof of address',
      'Phone number verification'
    ],
    benefits: [
      'Transfer up to $1,000 per transaction',
      'Higher monthly limits',
      'Priority customer support',
      'Access to business features'
    ],
    upgradeRequirements: ['Enhanced due diligence', 'Source of funds documentation']
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    dailyLimit: 10000,
    monthlyLimit: 50000,
    yearlyLimit: 250000,
    singleTransactionLimit: 5000,
    description: 'Maximum limits for frequent users and businesses',
    requirements: [
      'Enhanced identity verification',
      'Source of funds documentation',
      'Regular activity review'
    ],
    benefits: [
      'Transfer up to $5,000 per transaction',
      'Highest available limits',
      'Dedicated account manager',
      'Custom compliance solutions',
      'Reduced fees for high volume'
    ]
  }
};