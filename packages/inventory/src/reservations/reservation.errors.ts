import { DomainError } from '@ananya/core';

export class InvalidQuantityError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidReservationStatusError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidComponentIdError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidLocationIdError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidBusinessReferenceError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidReservedByError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidUnitOfMeasureError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class ReservationExpiryCannotBeInPastError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class ReservationNotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
