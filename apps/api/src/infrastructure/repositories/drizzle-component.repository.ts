import { db } from '@ananya/database';
import { components } from '@ananya/database/schema';
import type {
  CreateComponentInput,
  Component,
  ComponentRepository,
} from '@ananya/inventory';
import { eq } from '@ananya/database/query';

type ComponentRow = typeof components.$inferSelect;

function toDomain(row: ComponentRow): Component {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    description: row.description,
    manufacturerId: row.manufacturerId,
    categoryId: row.categoryId,
    defaultLocationId: row.defaultLocationId,
    unit: row.unit,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toRow(
  component: CreateComponentInput,
): Omit<ComponentRow, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    sku: component.sku,
    name: component.name,
    description: component.description ?? null,
    manufacturerId: component.manufacturerId ?? null,
    categoryId: component.categoryId ?? null,
    defaultLocationId: component.defaultLocationId ?? null,
    unit: component.unit,
    isActive: true,
  };
}

export class DrizzleComponentRepository implements ComponentRepository {
  async findById(id: string): Promise<Component | null> {
    const [row] = await db
      .select()
      .from(components)
      .where(eq(components.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findBySku(sku: string): Promise<Component | null> {
    const [row] = await db
      .select()
      .from(components)
      .where(eq(components.sku, sku))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<Component[]> {
    const rows = await db.select().from(components).orderBy(components.sku);

    return rows.map(toDomain);
  }

  async create(input: CreateComponentInput): Promise<Component> {
    const [row] = await db.insert(components).values(toRow(input)).returning();

    if (!row) {
      throw new Error('Failed to create component');
    }

    return toDomain(row);
  }
}
