import { DomainError } from "./domain-error";

/**
 * Error thrown when a resource is not found.
 */
export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
