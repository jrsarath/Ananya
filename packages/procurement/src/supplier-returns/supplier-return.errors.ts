import { DomainError } from "@ananya/core";

export class InvalidSupplierReturnStatusError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSupplierReturnStatusError";
  }
}
