import { InventoryTransaction } from './inventory-transaction';
import type { FindManyInventoryTransactionsOptions } from './inventory-transaction.types';


export interface InventoryTransactionRepository {
  findById(id: string): Promise<InventoryTransaction | null>;
  findMany(options?: FindManyInventoryTransactionsOptions): Promise<InventoryTransaction[]>;
  save(transaction: InventoryTransaction): Promise<InventoryTransaction>;
}