import { DomainError } from "@ananya/core";

export class InvalidSupplierCodeError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSupplierCodeError";
  }
}

export class InvalidSupplierNameError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSupplierNameError";
  }
}

export class DuplicateSupplierCodeError extends DomainError {
  constructor(code: string) {
    super(`Supplier with code "${code}" already exists.`);
    this.name = "DuplicateSupplierCodeError";
  }
}
