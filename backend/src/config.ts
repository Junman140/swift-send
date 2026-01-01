import dotenv from 'dotenv';

dotenv.config();

type Environment = 'development' | 'test' | 'production';
type StellarNetwork = 'TESTNET' | 'PUBLIC';

export interface AppConfig {
  env: Environment;
  server: {
    host: string;
    port: number;
    basePath: string;
  };
  logging: {
    level: string;
    pretty: boolean;
  };
  stellar: {
    network: StellarNetwork;
    horizonUrl: string;
    distributionAccount: string;
    distributionSecret?: string;
    assetCode: string;
    assetIssuer: string;
    simulateSubmission: boolean;
  };
  persistence: {
    databaseUrl: string;
  };
  queues: {
    settlementDelayMs: number;
    maxSettlementAttempts: number;
  };
  features: {
    enableEscrow: boolean;
    enableRiskScoring: boolean;
  };
}

const intFromEnv = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const boolFromEnv = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const toStellarNetwork = (value: string | undefined): StellarNetwork => {
  if (!value) return 'TESTNET';
  return value.toUpperCase() === 'PUBLIC' ? 'PUBLIC' : 'TESTNET';
};

export const config: AppConfig = {
  env: (process.env.NODE_ENV as Environment) || 'development',
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: intFromEnv(process.env.PORT, 4000),
    basePath: process.env.API_BASE_PATH || '',
  },
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    pretty: boolFromEnv(process.env.LOG_PRETTY, process.env.NODE_ENV !== 'production'),
  },
  stellar: {
    network: toStellarNetwork(process.env.STELLAR_NETWORK),
    horizonUrl:
      process.env.STELLAR_HORIZON_URL ||
      (process.env.STELLAR_NETWORK === 'PUBLIC'
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org'),
    distributionAccount: process.env.STELLAR_DISTRIBUTION_ACCOUNT || 'GDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    distributionSecret: process.env.STELLAR_DISTRIBUTION_SECRET,
    assetCode: process.env.STELLAR_ASSET_CODE || 'USDC',
    assetIssuer: process.env.STELLAR_ASSET_ISSUER || 'GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    simulateSubmission: boolFromEnv(process.env.SIMULATE_STELLAR, true),
  },
  persistence: {
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/swiftsend',
  },
  queues: {
    settlementDelayMs: intFromEnv(process.env.WORKER_DELAY_MS, 2000),
    maxSettlementAttempts: intFromEnv(process.env.SETTLEMENT_MAX_ATTEMPTS, 3),
  },
  features: {
    enableEscrow: boolFromEnv(process.env.FEATURE_ESCROW, true),
    enableRiskScoring: boolFromEnv(process.env.FEATURE_RISK_SCORING, true),
  },
};

export const isProd = () => config.env === 'production';
