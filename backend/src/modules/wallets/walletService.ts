import { ValidationError, NotFoundError } from '../../errors';
import { logger } from '../../logger';
import { postEntry } from '../../services/ledger';
import {
  createEscrow,
  EscrowEntry,
  getEscrow as getEscrowEntry,
  releaseEscrow,
  refundEscrow,
} from '../../services/escrow';

export interface ReserveFundsRequest {
  walletId: string;
  transferId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

export interface SettlementRequest {
  transferId: string;
  destinationAccount: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

export class WalletService {
  async reserveFunds(request: ReserveFundsRequest): Promise<EscrowEntry> {
    if (!request.amount || request.amount <= 0) {
      throw new ValidationError('Amount must be greater than zero');
    }
    await postEntry(
      request.walletId,
      `escrow:${request.transferId}`,
      request.amount,
      request.currency,
      'reserve',
      request.metadata
    );
    const escrow = await createEscrow(request.transferId, request.amount, request.currency);
    logger.debug({ transferId: request.transferId }, 'funds reserved');
    return escrow;
  }

  async settleEscrow(request: SettlementRequest) {
    const escrow = await getEscrowEntry(request.transferId);
    if (!escrow) throw new NotFoundError('Escrow not found');

    await postEntry(
      `escrow:${request.transferId}`,
      request.destinationAccount,
      request.amount,
      request.currency,
      'settle',
      request.metadata
    );
    await releaseEscrow(request.transferId);
    logger.info({ transferId: request.transferId, destination: request.destinationAccount }, 'escrow released');
    return escrow;
  }

  async refundEscrow(request: SettlementRequest) {
    const escrow = await getEscrowEntry(request.transferId);
    if (!escrow) throw new NotFoundError('Escrow not found');

    await postEntry(
      `escrow:${request.transferId}`,
      request.destinationAccount,
      request.amount,
      request.currency,
      'refund',
      request.metadata
    );
    await refundEscrow(request.transferId);
    logger.warn({ transferId: request.transferId }, 'escrow refunded');
    return escrow;
  }

  async getEscrow(transferId: string) {
    return getEscrowEntry(transferId);
  }
}
