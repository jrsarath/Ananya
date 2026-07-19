import type { CreateReservationProps } from './reservation.types';
import { Reservation } from './reservation';

export function createReservation(props: CreateReservationProps): Reservation {
  return Reservation.create(props);
}
