/**
 * Base error class for all domain errors in Ananya.
 * All domain-specific errors should extend this class.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
  }
}
