import { Inject, Injectable } from '@nestjs/common';
import {
  createInventoryTransaction,
  type CreateInventoryTransactionProps,
  type InventoryTransaction,
  type InventoryTransactionRepository,
} from '@ananya/inventory';
import { INVENTORY_TRANSACTION_REPOSITORY } from './inventory-transaction.tokens';

@Injectable()
export class InventoryTransactionsService {
  constructor(
    @Inject(INVENTORY_TRANSACTION_REPOSITORY)
    private readonly repository: InventoryTransactionRepository,
  ) {}

  async create(
    input: CreateInventoryTransactionProps,
  ): Promise<InventoryTransaction> {
    const tx = createInventoryTransaction(input);
    return this.repository.save(tx);
  }

  async getAll(): Promise<InventoryTransaction[]> {
    return this.repository.findMany();
  }

  async getById(id: string): Promise<InventoryTransaction | null> {
    return this.repository.findById(id);
  }
}
