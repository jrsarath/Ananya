import { db } from '@ananya/database';
import { inventoryProjections } from '@ananya/database/schema';
import type { InventoryProjection, InventoryProjectionRepository } from '@ananya/inventory';
import { eq, and } from '@ananya/database/query';
import type { InventoryProjection as ProjectionRow } from '@ananya/database/schema';
import { InventoryProjection as ProjectionAggregate } from '@ananya/inventory';

function toDomain(row: ProjectionRow): InventoryProjection {
  return ProjectionAggregate.rehydrate({
    id: row.id,
    componentId: row.componentId,
    locationId: row.locationId,
    quantityOnHand: parseFloat(row.quantityOnHand),
    quantityAvailable: parseFloat(row.quantityAvailable),
    quantityReserved: parseFloat(row.quantityReserved),
    unitOfMeasure: row.unitOfMeasure,
    lastTransactionAt: row.lastTransactionAt ?? undefined,
    lastCalculatedAt: row.lastCalculatedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function toRow(
  projection: InventoryProjection,
): Omit<ProjectionRow, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    componentId: projection.componentId,
    locationId: projection.locationId,
    quantityOnHand: projection.quantityOnHand.toString(),
    quantityAvailable: projection.quantityAvailable.toString(),
    quantityReserved: projection.quantityReserved.toString(),
    unitOfMeasure: projection.unitOfMeasure,
    lastTransactionAt: projection.lastTransactionAt ?? null,
    lastCalculatedAt: projection.lastCalculatedAt,
  };
}

export class DrizzleInventoryProjectionRepository implements InventoryProjectionRepository {
  async findById(id: string): Promise<InventoryProjection | null> {
    const [row] = await db
      .select()
      .from(inventoryProjections)
      .where(eq(inventoryProjections.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findByComponentAndLocation(
    componentId: string,
    locationId: string,
  ): Promise<InventoryProjection | null> {
    const [row] = await db
      .select()
      .from(inventoryProjections)
      .where(
        and(
          eq(inventoryProjections.componentId, componentId),
          eq(inventoryProjections.locationId, locationId),
        ),
      )
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findManyByComponent(componentId: string): Promise<InventoryProjection[]> {
    const rows = await db
      .select()
      .from(inventoryProjections)
      .where(eq(inventoryProjections.componentId, componentId));

    return rows.map(toDomain);
  }

  async findManyByLocation(locationId: string): Promise<InventoryProjection[]> {
    const rows = await db
      .select()
      .from(inventoryProjections)
      .where(eq(inventoryProjections.locationId, locationId));

    return rows.map(toDomain);
  }

  async save(projection: InventoryProjection): Promise<InventoryProjection> {
    const row = toRow(projection);
    
    const [result] = await db
      .insert(inventoryProjections)
      .values(row)
      .onConflictDoUpdate({
        target: [inventoryProjections.componentId, inventoryProjections.locationId],
        set: {
          quantityOnHand: row.quantityOnHand,
          quantityAvailable: row.quantityAvailable,
          quantityReserved: row.quantityReserved,
          lastTransactionAt: row.lastTransactionAt,
          lastCalculatedAt: row.lastCalculatedAt,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!result) {
      throw new Error('Inventory projection upsert returned no row');
    }

    return toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await db.delete(inventoryProjections).where(eq(inventoryProjections.id, id));
  }

  async deleteByComponentAndLocation(componentId: string, locationId: string): Promise<void> {
    await db
      .delete(inventoryProjections)
      .where(
        and(
          eq(inventoryProjections.componentId, componentId),
          eq(inventoryProjections.locationId, locationId),
        ),
      );
  }
}
