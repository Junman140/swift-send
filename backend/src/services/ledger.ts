import { v4 as uuidv4 } from 'uuid';

export interface LedgerEntry {
  id: string;
  debit_account: string | null;
  credit_account: string | null;
  amount: number;
  currency: string;
  type: string;
  metadata?: any;
  created_at: string;
}

const entries: LedgerEntry[] = [];

export async function postEntry(debit: string | null, credit: string | null, amount: number, currency = 'USD', type = 'transfer', metadata?: any) {
  const e: LedgerEntry = {
    id: uuidv4(),
    debit_account: debit,
    credit_account: credit,
    amount,
    currency,
    type,
    metadata,
    created_at: new Date().toISOString()
  };
  entries.push(e);
  return e;
}

export async function getEntries() { return entries; }
