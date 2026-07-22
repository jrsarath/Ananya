import { db } from '@ananya/database';
import { inventoryReservations } from '@ananya/database/schema';
import type { Reservation, ReservationRepository } from '@ananya/inventory';
import { ReservationStatus } from '@ananya/inventory';
import { and, eq } from '@ananya/database/query';
import type { InventoryReservationRow } from '@ananya/database/schema';
import { Reservation as ReservationAggregate } from '@ananya/inventory';

function toDomain(row: InventoryReservationRow): Reservation {
  return ReservationAggregate.rehydrate({
    id: row.id,
    componentId: row.componentId,
    locationId: row.locationId,
    quantity: row.quantity,
    unitOfMeasure: row.unitOfMeasure,
    reference: row.reference ?? undefined,
    reservedBy: row.reservedBy,
    status: row.status as ReservationStatus,
    createdAt: row.createdAt,
    expiresAt: row.expiresAt ?? null,
  });
}

function toRow(
  reservation: Reservation,
): Omit<InventoryReservationRow, 'id' | 'createdAt'> {
  return {
    componentId: reservation.componentId,
    locationId: reservation.locationId,
    quantity: reservation.quantity,
    unitOfMeasure: reservation.unitOfMeasure,
    reference: reservation.reference ?? null,
    reservedBy: reservation.reservedBy,
    status: reservation.status,
    expiresAt: reservation.expiresAt ?? null,
  };
}

export class DrizzleReservationRepository implements ReservationRepository {
  async findById(id: string): Promise<Reservation | null> {
    const [row] = await db
      .select()
      .from(inventoryReservations)
      .where(eq(inventoryReservations.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findActiveByComponentAndLocation(
    componentId: string,
    locationId: string,
  ): Promise<Reservation[]> {
    const rows = await db
      .select()
      .from(inventoryReservations)
      .where(
        and(
          eq(inventoryReservations.componentId, componentId),
          eq(inventoryReservations.locationId, locationId),
          eq(inventoryReservations.status, ReservationStatus.Active),
        ),
      );

    return rows.map(toDomain);
  }

  async save(reservation: Reservation): Promise<Reservation> {
    const existing = await this.findById(reservation.id);

    if (existing) {
      const [updatedRow] = await db
        .update(inventoryReservations)
        .set({
          status: reservation.status,
          expiresAt: reservation.expiresAt ?? null,
        })
        .where(eq(inventoryReservations.id, reservation.id))
        .returning();

      if (!updatedRow) {
        throw new Error('Failed to update reservation');
      }

      return toDomain(updatedRow);
    }

    const [insertedRow] = await db
      .insert(inventoryReservations)
      .values(toRow(reservation))
      .returning();

    if (!insertedRow) {
      throw new Error('Failed to create reservation');
    }

    return toDomain(insertedRow);
  }
}
