import { DomainError } from "./domain-error";

/**
 * Generic error for when an operation fails due to invalid input.
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}