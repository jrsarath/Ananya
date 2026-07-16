import { DomainError } from '@ananya/core';

export class InvalidTransactionTypeError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidQuantityError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidLocationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InventoryTransactionNotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}