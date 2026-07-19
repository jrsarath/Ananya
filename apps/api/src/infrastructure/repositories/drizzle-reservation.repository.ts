import { db } from '@ananya/database';
import { reservations } from '@ananya/database/schema';
import type { Reservation, ReservationRepository } from '@ananya/inventory';
import { eq, and, asc } from '@ananya/database/query';
import type { Reservation as ReservationRow } from '@ananya/database/schema';
import { Reservation as ReservationAggregate } from '@ananya/inventory';
import type { FindManyReservationsOptions } from '@ananya/inventory';

function toDomain(row: ReservationRow): Reservation {
  return ReservationAggregate.rehydrate({
    id: row.id,
    componentId: row.componentId,
    quantity: parseFloat(row.quantity),
    unitOfMeasure: row.unitOfMeasure,
    locationId: row.locationId,
    businessReference: row.businessReference,
    reservedBy: row.reservedBy,
    status: row.status as any,
    expiry: row.expiry ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    fulfilledAt: row.fulfilledAt ?? undefined,
    cancelledAt: row.cancelledAt ?? undefined,
  });
}

function toRow(
  reservation: Reservation,
): Omit<ReservationRow, 'id' | 'createdAt' | 'fulfilledAt' | 'cancelledAt'> {
  return {
    componentId: reservation.componentId,
    quantity: reservation.quantity.toString(),
    unitOfMeasure: reservation.unitOfMeasure,
    locationId: reservation.locationId,
    businessReference: reservation.businessReference,
    reservedBy: reservation.reservedBy,
    status: reservation.status,
    expiry: reservation.expiry ?? null,
    notes: reservation.notes ?? null,
  };
}

export class DrizzleReservationRepository implements ReservationRepository {
  async findById(id: string): Promise<Reservation | null> {
    const [row] = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findMany(options?: FindManyReservationsOptions): Promise<Reservation[]> {
    const conditions = [];

    if (options?.componentId) {
      conditions.push(eq(reservations.componentId, options.componentId));
    }

    if (options?.locationId) {
      conditions.push(eq(reservations.locationId, options.locationId));
    }

    if (options?.status) {
      conditions.push(eq(reservations.status, options.status));
    }

    if (options?.businessReference) {
      conditions.push(eq(reservations.businessReference, options.businessReference));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(reservations)
      .where(whereClause)
      .orderBy(asc(reservations.createdAt));

    return rows.map(toDomain);
  }

  async save(reservation: Reservation): Promise<Reservation> {
    const [row] = await db
      .insert(reservations)
      .values(toRow(reservation))
      .returning();

    if (!row) {
      throw new Error('Reservation insert returned no row');
    }

    return toDomain(row);
  }
}
