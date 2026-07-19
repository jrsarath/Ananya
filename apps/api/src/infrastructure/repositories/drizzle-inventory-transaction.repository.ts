import { db } from '@ananya/database';
import { inventoryTransactions } from '@ananya/database/schema';
import type { InventoryTransaction, InventoryTransactionRepository } from '@ananya/inventory';
import { eq, and, asc } from '@ananya/database/query';
import type { InventoryTransaction as TransactionRow } from '@ananya/database/schema';
import { InventoryTransaction as TransactionAggregate } from '@ananya/inventory';
import type { FindManyInventoryTransactionsOptions } from '@ananya/inventory';

function toDomain(row: TransactionRow): InventoryTransaction {
  return TransactionAggregate.rehydrate({
    id: row.id,
    componentId: row.componentId,
    quantity: parseFloat(row.quantity),
    unitOfMeasure: row.unitOfMeasure,
    locationId: row.locationId,
    transactionType: row.transactionType as any,
    reference: row.reference,
    batchId: row.batchId ?? undefined,
    serialId: row.serialId ?? undefined,
    reservationId: row.reservationId ?? undefined,
    performedBy: row.performedBy,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
  });
}

function toRow(
  transaction: InventoryTransaction,
): Omit<TransactionRow, 'id' | 'createdAt'> {
  return {
    componentId: transaction.componentId,
    quantity: transaction.quantity.toString(),
    unitOfMeasure: transaction.unitOfMeasure,
    locationId: transaction.locationId,
    transactionType: transaction.transactionType,
    reference: transaction.reference,
    batchId: transaction.batchId ?? null,
    serialId: transaction.serialId ?? null,
    reservationId: transaction.reservationId ?? null,
    performedBy: transaction.performedBy,
    notes: transaction.notes ?? null,
  };
}

export class DrizzleInventoryTransactionRepository implements InventoryTransactionRepository {
  async findById(id: string): Promise<InventoryTransaction | null> {
    const [row] = await db
      .select()
      .from(inventoryTransactions)
      .where(eq(inventoryTransactions.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findMany(options?: FindManyInventoryTransactionsOptions): Promise<InventoryTransaction[]> {
    const conditions = [];

    if (options?.componentId) {
      conditions.push(eq(inventoryTransactions.componentId, options.componentId));
    }

    if (options?.locationId) {
      conditions.push(eq(inventoryTransactions.locationId, options.locationId));
    }

    if (options?.transactionType) {
      conditions.push(eq(inventoryTransactions.transactionType, options.transactionType));
    }

    if (options?.batchId) {
      conditions.push(eq(inventoryTransactions.batchId, options.batchId));
    }

    if (options?.serialId) {
      conditions.push(eq(inventoryTransactions.serialId, options.serialId));
    }

    if (options?.reservationId) {
      conditions.push(eq(inventoryTransactions.reservationId, options.reservationId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(inventoryTransactions)
      .where(whereClause)
      .orderBy(asc(inventoryTransactions.createdAt));

    return rows.map(toDomain);
  }

  async save(transaction: InventoryTransaction): Promise<InventoryTransaction> {
    const [row] = await db
      .insert(inventoryTransactions)
      .values(toRow(transaction))
      .returning();

    if (!row) {
      throw new Error('Inventory transaction insert returned no row');
    }

    return toDomain(row);
  }
}
