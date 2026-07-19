import { Reservation } from './reservation';
import type { FindManyReservationsOptions } from './reservation.types';

export interface ReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  findMany(options?: FindManyReservationsOptions): Promise<Reservation[]>;
  save(reservation: Reservation): Promise<Reservation>;
}
