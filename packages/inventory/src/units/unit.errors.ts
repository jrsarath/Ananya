import { DomainError } from "@ananya/core";

export class UnitNameAlreadyExistsError extends DomainError {
  constructor(name: string) {
    super(`Unit with name '${name}' already exists.`);
  }
}

export class UnitNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Unit not found: ${id}`);
  }
}

export class InvalidUnitNameError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidUnitCategoryError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}