import { Inject, Injectable } from '@nestjs/common';
import {
  CreateReservation,
  type CreateReservationInput,
  type Reservation,
  type ReservationRepository,
  ReservationNotFoundError,
} from '@ananya/inventory';
import { RESERVATION_REPOSITORY } from './reservation.tokens';

@Injectable()
export class ReservationsService {
  private readonly createReservation: CreateReservation;

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly repository: ReservationRepository,
  ) {
    this.createReservation = new CreateReservation(repository);
  }

  create(input: CreateReservationInput): Promise<Reservation> {
    return this.createReservation.execute(input);
  }

  getAllReservations(options?: any): Promise<Reservation[]> {
    return this.repository.findMany(options);
  }

  async getReservation(id: string): Promise<Reservation> {
    const reservation = await this.repository.findById(id);
    if (!reservation) {
      throw new ReservationNotFoundError(id);
    }
    return reservation;
  }
}
