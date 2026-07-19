import { db } from '@ananya/database';
import { serials } from '@ananya/database/schema';
import type { Serial } from '@ananya/inventory';
import { eq, and, asc } from '@ananya/database/query';
import type { Serial as SerialRow } from '@ananya/database/schema';
import { Serial as SerialAggregate } from '@ananya/inventory';
import type { FindManySerialsOptions } from '@ananya/inventory';

function toDomain(row: SerialRow): Serial {
  return SerialAggregate.rehydrate({
    id: row.id,
    componentId: row.componentId,
    serialNumber: row.serialNumber,
    unitOfMeasure: row.unitOfMeasure,
    locationId: row.locationId,
    status: row.status as any,
    manufactureDate: row.manufactureDate ? new Date(row.manufactureDate) : undefined,
    receivedBy: row.receivedBy,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    consumedAt: row.consumedAt ?? undefined,
    consumedBy: row.consumedBy ?? undefined,
    lostAt: row.lostAt ?? undefined,
    damagedAt: row.damagedAt ?? undefined,
    quarantinedAt: row.quarantinedAt ?? undefined,
    quarantinedBy: row.quarantinedBy ?? undefined,
    quarantineReason: row.quarantineReason ?? undefined,
  });
}

function toRow(
  serial: Serial,
): Omit<SerialRow, 'id' | 'createdAt' | 'consumedAt' | 'lostAt' | 'damagedAt' | 'quarantinedAt'> {
  return {
    componentId: serial.componentId,
    serialNumber: serial.serialNumber,
    unitOfMeasure: serial.unitOfMeasure,
    locationId: serial.locationId,
    status: serial.status,
    manufactureDate: serial.manufactureDate ? serial.manufactureDate.toISOString().split('T')[0] : null,
    receivedBy: serial.receivedBy,
    notes: serial.notes ?? null,
    consumedAt: serial.consumedAt ?? null,
    consumedBy: serial.consumedBy ?? null,
    lostAt: serial.lostAt ?? null,
    damagedAt: serial.damagedAt ?? null,
    quarantinedAt: serial.quarantinedAt ?? null,
    quarantinedBy: serial.quarantinedBy ?? null,
    quarantineReason: serial.quarantineReason ?? null,
  };
}

export class DrizzleSerialRepository implements SerialRepository {
  async findById(id: string): Promise<Serial | null> {
    const [row] = await db
      .select()
      .from(serials)
      .where(eq(serials.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findBySerialNumber(serialNumber: string): Promise<Serial | null> {
    const [row] = await db
      .select()
      .from(serials)
      .where(eq(serials.serialNumber, serialNumber))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findMany(options?: FindManySerialsOptions): Promise<Serial[]> {
    const conditions = [];

    if (options?.componentId) {
      conditions.push(eq(serials.componentId, options.componentId));
    }

    if (options?.locationId) {
      conditions.push(eq(serials.locationId, options.locationId));
    }

    if (options?.status) {
      conditions.push(eq(serials.status, options.status));
    }

    if (options?.serialNumber) {
      conditions.push(eq(serials.serialNumber, options.serialNumber));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(serials)
      .where(whereClause)
      .orderBy(asc(serials.createdAt));

    return rows.map(toDomain);
  }

  async save(serial: Serial): Promise<Serial> {
    const [row] = await db
      .insert(serials)
      .values(toRow(serial))
      .returning();

    if (!row) {
      throw new Error('Serial insert returned no row');
    }

    return toDomain(row);
  }
}
