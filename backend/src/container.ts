import { config, AppConfig } from './config';
import { EventBus } from './core/eventBus';
import { ComplianceService } from './modules/compliance/complianceService';
import { SystemHealthService } from './modules/system/systemHealthService';
import { InMemoryTransferRepository } from './modules/transfers/inMemoryTransferRepository';
import { TransferLifecycle } from './modules/transfers/transferLifecycle';
import { WalletService } from './modules/wallets/walletService';

export interface AppContainer {
  config: AppConfig;
  eventBus: EventBus;
  services: {
    transfers: TransferLifecycle;
    wallets: WalletService;
    compliance: ComplianceService;
    health: SystemHealthService;
  };
}

export function createContainer(): AppContainer {
  const eventBus = new EventBus();
  const compliance = new ComplianceService();
  const wallets = new WalletService();
  const transferRepository = new InMemoryTransferRepository();
  const transfers = new TransferLifecycle(transferRepository, wallets, compliance, eventBus);
  const health = new SystemHealthService(compliance, wallets);

  return {
    config,
    eventBus,
    services: {
      transfers,
      wallets,
      compliance,
      health,
    },
  };
}
