import type { CreateReservationInput } from "./reservation.types";
import { Reservation } from "./reservation";

export function createReservation(input: CreateReservationInput): Reservation {
  return Reservation.create(input);
}
