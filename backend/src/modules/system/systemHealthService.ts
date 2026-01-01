import { config } from '../../config';
import { ComplianceService } from '../compliance/complianceService';
import { WalletService } from '../wallets/walletService';

export class SystemHealthService {
  constructor(private readonly compliance: ComplianceService, private readonly wallets: WalletService) {}

  async liveness() {
    return { status: 'alive', timestamp: new Date().toISOString() };
  }

  async readiness() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      environment: config.env,
      stellar: {
        network: config.stellar.network,
        horizonUrl: config.stellar.horizonUrl,
      },
      queues: {
        settlementDelayMs: config.queues.settlementDelayMs,
        maxAttempts: config.queues.maxSettlementAttempts,
      },
    };
  }
}
