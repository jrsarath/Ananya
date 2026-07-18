import { db } from '@ananya/database';
import { units } from '@ananya/database/schema';
import type { Unit, UnitRepository } from '@ananya/inventory';
import { eq } from '@ananya/database/query';
import type { Unit as UnitRow } from '@ananya/database/schema';
import { Unit as UnitAggregate } from '@ananya/inventory';

function toDomain(row: UnitRow): Unit {
  return UnitAggregate.rehydrate({
    id: row.id,
    name: row.name,
    category: row.category,
    isBaseUnit: row.isBaseUnit,
    conversionFactor: row.conversionFactor ? Number(row.conversionFactor) : null,
    precision: Number(row.precision),
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function toRow(
  unit: Unit,
): Omit<UnitRow, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: unit.name,
    category: unit.category,
    isBaseUnit: unit.isBaseUnit,
    conversionFactor: unit.conversionFactor ? String(unit.conversionFactor) : null,
    precision: String(unit.precision),
    isActive: unit.isActive,
  };
}

export class DrizzleUnitRepository implements UnitRepository {
  async findById(id: string): Promise<Unit | null> {
    const [row] = await db
      .select()
      .from(units)
      .where(eq(units.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findByName(name: string): Promise<Unit | null> {
    const [row] = await db
      .select()
      .from(units)
      .where(eq(units.name, name))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findByCategory(category: string): Promise<Unit[]> {
    const rows = await db
      .select()
      .from(units)
      .where(eq(units.category, category));

    return rows.map(toDomain);
  }

  async findMany(): Promise<Unit[]> {
    const rows = await db.select().from(units).orderBy(units.name);

    return rows.map(toDomain);
  }

  async save(unit: Unit): Promise<Unit> {
    const [row] = await db
      .insert(units)
      .values(toRow(unit))
      .returning();

    if (!row) {
      throw new Error('Failed to create unit');
    }

    return toDomain(row);
  }
}