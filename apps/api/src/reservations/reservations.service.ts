import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  createReservation,
  type CreateReservationInput,
  type InventoryProjectionRepository,
  type Reservation,
  type ReservationRepository,
} from '@ananya/inventory';
import { RESERVATION_REPOSITORY } from './reservation.tokens';
import { INVENTORY_PROJECTION_REPOSITORY } from '../inventory-projections/inventory-projection.tokens';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository,
    @Inject(INVENTORY_PROJECTION_REPOSITORY)
    private readonly projectionRepository: InventoryProjectionRepository,
  ) {}

  async create(input: CreateReservationInput): Promise<Reservation> {
    const reservation = createReservation(input);
    return this.reservationRepository.save(reservation);
  }

  async getById(id: string): Promise<Reservation> {
    const res = await this.reservationRepository.findById(id);
    if (!res) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return res;
  }

  async fulfill(id: string): Promise<Reservation> {
    const res = await this.getById(id);
    res.fulfill();
    return this.reservationRepository.save(res);
  }

  async cancel(id: string): Promise<Reservation> {
    const res = await this.getById(id);
    res.cancel();
    return this.reservationRepository.save(res);
  }

  async getAvailableQuantity(
    componentId: string,
    locationId: string,
  ): Promise<{ onHand: number; reserved: number; available: number }> {
    const projection =
      await this.projectionRepository.findByComponentAndLocation(
        componentId,
        locationId,
      );
    const onHand = projection ? projection.quantity : 0;

    const activeReservations =
      await this.reservationRepository.findActiveByComponentAndLocation(
        componentId,
        locationId,
      );
    const reserved = activeReservations.reduce((sum, r) => sum + r.quantity, 0);

    const available = onHand - reserved;

    return { onHand, reserved, available };
  }
}
