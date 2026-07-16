import { DomainError } from "@ananya/core";

export class LocationCodeAlreadyExistsError extends DomainError {
  constructor(code: string) {
    super(`Location with code '${code}' already exists.`);
  }
}

export class ParentLocationNotFoundError extends DomainError {
  constructor(parentId: string) {
    super(`Parent location not found: ${parentId}`);
  }
}

export class InactiveParentLocationError extends DomainError {
  constructor(parentId: string) {
    super(`Cannot create a location under inactive parent: ${parentId}`);
  }
}

export class LocationNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Location not found: ${id}`);
  }
}
