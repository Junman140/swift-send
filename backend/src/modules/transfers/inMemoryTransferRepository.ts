import { TransferRecord } from './domain';
import { TransferRepository } from './repository';

export class InMemoryTransferRepository implements TransferRepository {
  private readonly store = new Map<string, TransferRecord>();

  async findById(id: string) {
    return this.clone(this.store.get(id));
  }

  async findByClientReference(reference: string) {
    return this.clone(this.store.get(reference));
  }

  async save(record: TransferRecord) {
    this.store.set(record.id, this.clone(record));
    return record;
  }

  async update(record: TransferRecord) {
    if (!this.store.has(record.id)) {
      throw new Error('transfer not found');
    }
    this.store.set(record.id, this.clone(record));
    return record;
  }

  async listPending() {
    return Array.from(this.store.values())
      .filter((record) => ['held', 'submitted'].includes(record.state))
      .map((record) => this.clone(record));
  }

  private clone(record?: TransferRecord | null) {
    return record ? JSON.parse(JSON.stringify(record)) : null;
  }
}
