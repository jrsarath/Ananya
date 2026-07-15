import { DomainError } from "@ananya/core";

export class ManufacturerCodeAlreadyExistsError extends DomainError {
  constructor(code: string) {
    super(`Manufacturer with code '${code}' already exists.`);
  }
}

export class ManufacturerNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Manufacturer not found: ${id}`);
  }
}