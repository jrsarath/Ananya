import { DomainError } from "@ananya/core";

export class ComponentSkuAlreadyExistsError extends DomainError {
  constructor(sku: string) {
    super(`Component with SKU '${sku}' already exists.`);
  }
}

export class DefaultLocationNotFoundError extends DomainError {
  constructor(locationId: string) {
    super(`Default location with ID '${locationId}' not found.`);
  }
}

export class ComponentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Component not found: ${id}`);
  }
}
