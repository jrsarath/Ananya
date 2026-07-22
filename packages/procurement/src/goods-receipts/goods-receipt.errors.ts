import { DomainError } from "@ananya/core";

export class InvalidGoodsReceiptStatusError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidGoodsReceiptStatusError";
  }
}

export class InvalidReceivingQuantityError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidReceivingQuantityError";
  }
}
