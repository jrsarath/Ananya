import type { CreateLocationInput, Location } from "./location.js";
import {
  InactiveParentLocationError,
  LocationCodeAlreadyExistsError,
  ParentLocationNotFoundError,
} from "./location.errors.js";
import type { LocationRepository } from "./location.repository.js";

export class CreateLocation {
  constructor(private readonly locations: LocationRepository) {}

  async execute(input: CreateLocationInput): Promise<Location> {
    const code = input.code.trim().toUpperCase();
    const name = input.name.trim();
    const kind = input.kind.trim().toLowerCase();

    const existing = await this.locations.findByCode(code);

    if (existing) {
      throw new LocationCodeAlreadyExistsError(code);
    }

    if (input.parentId) {
      const parent = await this.locations.findById(input.parentId);

      if (!parent) {
        throw new ParentLocationNotFoundError(input.parentId);
      }

      if (!parent.isActive) {
        throw new InactiveParentLocationError(input.parentId);
      }
    }

    return this.locations.create({
      code,
      name,
      kind,
      parentId: input.parentId ?? null,
      metadata: input.metadata ?? {},
    });
  }
}
