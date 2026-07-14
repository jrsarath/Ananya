/**
 * Base error class for all domain errors in Ananya.
 * All domain-specific errors should extend this class.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

/**
 * Generic error for when an operation fails due to invalid input.
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Error thrown when a resource is not found.
 */
export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Error thrown when an operation violates a business rule or invariant.
 */
export class BusinessRuleError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "BusinessRuleError";
  }
}