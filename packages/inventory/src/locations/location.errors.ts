export class LocationCodeAlreadyExistsError extends Error {
  constructor(code: string) {
    super(`Location code already exists: ${code}`);
    this.name = "LocationCodeAlreadyExistsError";
  }
}

export class ParentLocationNotFoundError extends Error {
  constructor(parentId: string) {
    super(`Parent location not found: ${parentId}`);
    this.name = "ParentLocationNotFoundError";
  }
}

export class InactiveParentLocationError extends Error {
  constructor(parentId: string) {
    super(`Cannot create a location under inactive parent: ${parentId}`);
    this.name = "InactiveParentLocationError";
  }
}

export class LocationNotFoundError extends Error {
  constructor(id: string) {
    super(`Location not found: ${id}`);
    this.name = "LocationNotFoundError";
  }
}
