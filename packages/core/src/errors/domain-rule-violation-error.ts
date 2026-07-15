import { DomainError } from "./domain-error";

/**
 * Error thrown when an operation violates a business rule or invariant.
 */
export class BusinessRuleError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}