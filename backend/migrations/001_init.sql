-- Basic schema for prototype
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT,
  phone TEXT,
  kyc_status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  type TEXT,
  provider TEXT,
  public_key TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ledger_accounts (
  id TEXT PRIMARY KEY,
  wallet_id TEXT REFERENCES wallets(id),
  currency TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ledger_entries (
  id TEXT PRIMARY KEY,
  debit_account TEXT,
  credit_account TEXT,
  amount NUMERIC,
  currency TEXT,
  type TEXT,
  metadata JSONB,
  idempotency_key TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transfers (
  id TEXT PRIMARY KEY,
  external_id TEXT,
  from_wallet_id TEXT,
  to_info JSONB,
  amount NUMERIC,
  currency TEXT,
  fee NUMERIC DEFAULT 0,
  status TEXT,
  escrow_id TEXT,
  stellar_tx_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE escrows (
  id TEXT PRIMARY KEY,
  transfer_id TEXT UNIQUE REFERENCES transfers(id),
  amount NUMERIC,
  currency TEXT,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT,
  entity_id TEXT,
  action TEXT,
  actor_id TEXT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
