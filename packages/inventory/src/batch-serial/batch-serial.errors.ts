import { DomainError } from '@ananya/core';

export class InvalidBatchNumberError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidSerialNumberError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class DuplicateSerialNumberError extends DomainError {
  constructor(serialNumber: string) {
    super(`Duplicate serial number: ${serialNumber}`);
  }
}

export class BatchNotFoundError extends DomainError {
  constructor(batchId: string) {
    super(`Batch not found: ${batchId}`);
  }
}

export class SerialNotFoundError extends DomainError {
  constructor(serialId: string) {
    super(`Serial not found: ${serialId}`);
  }
}

export class InvalidQuantityError extends DomainError {
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

export class InvalidUnitOfMeasureError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidReceivedByError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class BatchAlreadyConsumedError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class SerialAlreadyConsumedError extends DomainError {
  constructor(serialNumber: string) {
    super(`Serial ${serialNumber} has already been consumed`);
  }
}

export class InvalidExpiryDateError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidManufactureDateError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
