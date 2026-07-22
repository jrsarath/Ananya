import { DomainError } from "@ananya/core";

export class InvalidReservationQuantityError extends DomainError {
  constructor(message = "Reservation quantity must be greater than zero") {
    super(message);
  }
}

export class ReservationNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Reservation with ID ${id} not found`);
  }
}

export class InvalidReservationStatusError extends DomainError {
  constructor(message = "Invalid reservation status transition") {
    super(message);
  }
}
