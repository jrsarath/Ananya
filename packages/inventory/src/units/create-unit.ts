import { Unit, type CreateUnitInput } from "./unit";
import { UnitNameAlreadyExistsError } from "./unit.errors";
import type { UnitRepository } from "./unit.repository";

export class CreateUnit {
  constructor(
    private readonly units: UnitRepository,
  ) {}

  async execute(input: CreateUnitInput): Promise<Unit> {
    // Normalize input for uniqueness check (the aggregate will normalize again)
    const name = input.name.trim();

    const existing = await this.units.findByName(name);

    if (existing) {
      throw new UnitNameAlreadyExistsError(name);
    }

    // Create the unit using factory method
    const unit = Unit.create(input);

    // Persist the aggregate
    return this.units.save(unit);
  }
}