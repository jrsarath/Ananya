import { db } from '@ananya/database';
import { locations } from '@ananya/database/schema';
import type {
  CreateLocationInput,
  Location,
  LocationRepository,
} from '@ananya/inventory';
import { eq } from '@ananya/database/query';

type LocationRow = typeof locations.$inferSelect;

function toDomain(row: LocationRow): Location {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    kind: row.kind,
    parentId: row.parentId,
    isActive: row.isActive,
    metadata: row.metadata,
  };
}

export class DrizzleLocationRepository implements LocationRepository {
  async findById(id: string): Promise<Location | null> {
    const [row] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findByCode(code: string): Promise<Location | null> {
    const [row] = await db
      .select()
      .from(locations)
      .where(eq(locations.code, code))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findMany(): Promise<Location[]> {
    const rows = await db.select().from(locations).orderBy(locations.code);

    return rows.map(toDomain);
  }

  async save(input: CreateLocationInput): Promise<Location> {
    const [row] = await db
      .insert(locations)
      .values({
        code: input.code,
        name: input.name,
        kind: input.kind,
        parentId: input.parentId ?? null,
        metadata: input.metadata ?? {},
      })
      .returning();

    if (!row) {
      throw new Error('Location insert returned no row');
    }

    return toDomain(row);
  }
}
