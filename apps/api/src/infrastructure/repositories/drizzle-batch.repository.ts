import { db } from '@ananya/database';
import { batches } from '@ananya/database/schema';
import type { Batch } from '@ananya/inventory';
import { eq, and, asc } from '@ananya/database/query';
import type { Batch as BatchRow } from '@ananya/database/schema';
import { Batch as BatchAggregate } from '@ananya/inventory';
import type { FindManyBatchesOptions } from '@ananya/inventory';

function toDomain(row: BatchRow): Batch {
  return BatchAggregate.rehydrate({
    id: row.id,
    componentId: row.componentId,
    batchNumber: row.batchNumber,
    quantity: parseFloat(row.quantity),
    consumedQuantity: parseFloat(row.consumedQuantity),
    unitOfMeasure: row.unitOfMeasure,
    locationId: row.locationId,
    status: row.status as any,
    manufactureDate: row.manufactureDate ? new Date(row.manufactureDate) : undefined,
    expiryDate: row.expiryDate ? new Date(row.expiryDate) : undefined,
    supplierReference: row.supplierReference ?? undefined,
    receivedBy: row.receivedBy,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    fullyConsumedAt: row.fullyConsumedAt ?? undefined,
    expiredAt: row.expiredAt ?? undefined,
    quarantinedAt: row.quarantinedAt ?? undefined,
    quarantinedBy: row.quarantinedBy ?? undefined,
    quarantineReason: row.quarantineReason ?? undefined,
  });
}

function toRow(
  batch: Batch,
): Omit<BatchRow, 'id' | 'createdAt' | 'fullyConsumedAt' | 'expiredAt' | 'quarantinedAt'> {
  return {
    componentId: batch.componentId,
    batchNumber: batch.batchNumber,
    quantity: batch.quantity.toString(),
    consumedQuantity: batch.consumedQuantity.toString(),
    unitOfMeasure: batch.unitOfMeasure,
    locationId: batch.locationId,
    status: batch.status,
    manufactureDate: batch.manufactureDate ? batch.manufactureDate.toISOString().split('T')[0] : null,
    expiryDate: batch.expiryDate ? batch.expiryDate.toISOString().split('T')[0] : null,
    supplierReference: batch.supplierReference ?? null,
    receivedBy: batch.receivedBy,
    notes: batch.notes ?? null,
    fullyConsumedAt: batch.fullyConsumedAt ?? null,
    expiredAt: batch.expiredAt ?? null,
    quarantinedAt: batch.quarantinedAt ?? null,
    quarantinedBy: batch.quarantinedBy ?? null,
    quarantineReason: batch.quarantineReason ?? null,
  };
}

export class DrizzleBatchRepository implements BatchRepository {
  async findById(id: string): Promise<Batch | null> {
    const [row] = await db
      .select()
      .from(batches)
      .where(eq(batches.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findByBatchNumber(batchNumber: string): Promise<Batch | null> {
    const [row] = await db
      .select()
      .from(batches)
      .where(eq(batches.batchNumber, batchNumber))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findMany(options?: FindManyBatchesOptions): Promise<Batch[]> {
    const conditions = [];

    if (options?.componentId) {
      conditions.push(eq(batches.componentId, options.componentId));
    }

    if (options?.locationId) {
      conditions.push(eq(batches.locationId, options.locationId));
    }

    if (options?.status) {
      conditions.push(eq(batches.status, options.status));
    }

    if (options?.batchNumber) {
      conditions.push(eq(batches.batchNumber, options.batchNumber));
    }

    if (options?.supplierReference) {
      conditions.push(eq(batches.supplierReference, options.supplierReference));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(batches)
      .where(whereClause)
      .orderBy(asc(batches.createdAt));

    return rows.map(toDomain);
  }

  async save(batch: Batch): Promise<Batch> {
    const [row] = await db
      .insert(batches)
      .values(toRow(batch))
      .returning();

    if (!row) {
      throw new Error('Batch insert returned no row');
    }

    return toDomain(row);
  }
}
