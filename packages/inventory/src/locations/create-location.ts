import { Location, type CreateLocationInput } from "./location";
import {
  InactiveParentLocationError,
  LocationCodeAlreadyExistsError,
  ParentLocationNotFoundError,
} from "./location.errors";
import type { LocationRepository } from "./location.repository";

export class CreateLocation {
  constructor(private readonly locations: LocationRepository) {}

  async execute(input: CreateLocationInput): Promise<Location> {
    // Normalize input for uniqueness check (the aggregate will normalize again)
    const code = input.code.trim().toUpperCase();

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

    // Create the location using factory method
    const location = Location.create(input);

    // Persist the aggregate
    return this.locations.save(location);
  }
}
