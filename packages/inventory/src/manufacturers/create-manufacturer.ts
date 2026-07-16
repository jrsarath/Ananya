import { Manufacturer, type CreateManufacturerInput } from "./manufacturer";
import { ManufacturerCodeAlreadyExistsError } from "./manufacturer.errors";
import type { ManufacturerRepository } from "./manufacturer.repository";

export class CreateManufacturer {
  constructor(
    private readonly manufacturers: ManufacturerRepository,
  ) {}

  async execute(input: CreateManufacturerInput): Promise<Manufacturer> {
    const code = input.code.trim().toLowerCase();
    const name = input.name.trim();

    const existing = await this.manufacturers.findByCode(code);

    if (existing) {
      throw new ManufacturerCodeAlreadyExistsError(code);
    }

    // Create the manufacturer using factory method
    return this.manufacturers.save(Manufacturer.create(input));
  }
}