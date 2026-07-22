import { DomainError } from "@ananya/core";

export class ThreeWayMatchError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "ThreeWayMatchError";
  }
}
