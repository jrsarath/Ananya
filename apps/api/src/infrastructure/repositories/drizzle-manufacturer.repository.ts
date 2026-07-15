import { db } from '@ananya/database';
import { manufacturers } from '@ananya/database/schema';
import type {
  CreateManufacturerInput,
  Manufacturer,
  ManufacturerRepository,
} from '@ananya/inventory';
import { eq } from '@ananya/database/query';

type ManufacturerRow = typeof manufacturers.$inferSelect;

function toDomain(row: ManufacturerRow): Manufacturer {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toRow(
  manufacturer: CreateManufacturerInput,
): Omit<ManufacturerRow, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    code: manufacturer.code,
    name: manufacturer.name,
    isActive: true,
  };
}

export class DrizzleManufacturerRepository implements ManufacturerRepository {
  async findById(id: string): Promise<Manufacturer | null> {
    const [row] = await db
      .select()
      .from(manufacturers)
      .where(eq(manufacturers.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findByCode(code: string): Promise<Manufacturer | null> {
    const [row] = await db
      .select()
      .from(manufacturers)
      .where(eq(manufacturers.code, code))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<Manufacturer[]> {
    const rows = await db
      .select()
      .from(manufacturers)
      .orderBy(manufacturers.code);

    return rows.map(toDomain);
  }

  async create(input: CreateManufacturerInput): Promise<Manufacturer> {
    const [row] = await db
      .insert(manufacturers)
      .values(toRow(input))
      .returning();

    if (!row) {
      throw new Error('Failed to create manufacturer');
    }

    return toDomain(row);
  }
}
