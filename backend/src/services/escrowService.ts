import * as escrowLib from './escrow';
import { postEntry } from './ledger';

export const escrowService = {
  async release(transferId: string) {
    const e = await escrowLib.getEscrow(transferId);
    if (!e) return null;
    const updated = await escrowLib.releaseEscrow(transferId);
    // ledger entry for release
    await postEntry(`escrow:${transferId}`, `recipient:${transferId}`, updated!.amount, updated!.currency, 'release');
    return updated;
  },

  async refund(transferId: string) {
    const e = await escrowLib.getEscrow(transferId);
    if (!e) return null;
    const updated = await escrowLib.refundEscrow(transferId);
    await postEntry(`escrow:${transferId}`, `wallet:${transferId}`, updated!.amount, updated!.currency, 'refund');
    return updated;
  }
};
