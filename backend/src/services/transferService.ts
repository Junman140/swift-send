import { v4 as uuidv4 } from 'uuid';
import { postEntry } from './ledger';
import * as escrowLib from './escrow';
import { config } from '../config';

export type Transfer = {
  id: string;
  from_wallet_id: string;
  to: any;
  amount: number;
  currency: string;
  status: string;
  escrow_id?: string;
  created_at: string;
};

const transfers: Record<string, Transfer> = {};

export const transferService = {
  async createTransfer(body: any) {
    if (!body || !body.idempotency_key || !body.from_wallet_id || !body.amount || !body.currency) {
      throw new Error('missing required fields');
    }
    const id = body.idempotency_key;
    if (transfers[id]) return transfers[id];

    const now = new Date().toISOString();
    const t: Transfer = { id, from_wallet_id: body.from_wallet_id, to: body.to, amount: body.amount, currency: body.currency, status: 'created', created_at: now };
    transfers[id] = t;

    // reserve ledger entry
    await postEntry(body.from_wallet_id, `escrow:${id}`, body.amount, body.currency, 'reserve', { transferId: id });

    const e = await escrowLib.createEscrow(id, body.amount, body.currency);
    t.escrow_id = e.id;
    t.status = 'held';

    // simulate async settlement
    setTimeout(async () => {
      try {
        await postEntry(`escrow:${id}`, body.to?.wallet_public_key || `recipient:${id}`, body.amount, body.currency, 'settle', { transferId: id });
        await escrowLib.releaseEscrow(id);
        transfers[id].status = 'completed';
      } catch (err) {
        await escrowLib.refundEscrow(id);
        transfers[id].status = 'failed';
      }
    }, config.workerDelayMs);

    return t;
  },

  getTransfer(id: string) {
    return transfers[id] || null;
  }
};
