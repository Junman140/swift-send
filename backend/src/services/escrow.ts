import { v4 as uuidv4 } from 'uuid';

export type EscrowStatus = 'held' | 'released' | 'refunded' | 'disputed' | 'delayed';

export interface EscrowEntry {
  id: string;
  transferId: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  createdAt: string;
  updatedAt: string;
}

const store: Record<string, EscrowEntry> = {};

export async function createEscrow(transferId: string, amount: number, currency = 'USD') {
  const id = uuidv4();
  const now = new Date().toISOString();
  const e: EscrowEntry = { id, transferId, amount, currency, status: 'held', createdAt: now, updatedAt: now };
  store[transferId] = e;
  return e;
}

export async function getEscrow(transferId: string) {
  return store[transferId] || null;
}

async function updateStatus(transferId: string, status: EscrowStatus) {
  const e = store[transferId];
  if (!e) return null;
  e.status = status;
  e.updatedAt = new Date().toISOString();
  return e;
}

export async function releaseEscrow(transferId: string) {
  return updateStatus(transferId, 'released');
}

export async function refundEscrow(transferId: string) {
  return updateStatus(transferId, 'refunded');
}
