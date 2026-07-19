import { Inject, Injectable } from '@nestjs/common';
import {
  InventoryTransaction,
  type CreateInventoryTransactionProps,
  type FindManyInventoryTransactionsOptions,
  InventoryTransactionNotFoundError,
} from '@ananya/inventory';
import { INVENTORY_TRANSACTION_REPOSITORY } from './ledger.tokens';
import type { InventoryTransactionRepository } from '@ananya/inventory';

@Injectable()
export class LedgerService {
  constructor(
    @Inject(INVENTORY_TRANSACTION_REPOSITORY)
    private readonly repository: InventoryTransactionRepository,
  ) {}

  async create(input: CreateInventoryTransactionProps): Promise<InventoryTransaction> {
    const transaction = InventoryTransaction.create(input);
    return this.repository.save(transaction);
  }

  async getTransaction(id: string): Promise<InventoryTransaction> {
    const transaction = await this.repository.findById(id);
    if (!transaction) {
      throw new InventoryTransactionNotFoundError(id);
    }
    return transaction;
  }

  async getAllTransactions(options?: FindManyInventoryTransactionsOptions): Promise<InventoryTransaction[]> {
    return this.repository.findMany(options);
  }
}
