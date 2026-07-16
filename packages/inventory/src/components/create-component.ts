import { Component, type CreateComponentInput } from "./component";
import { ComponentSkuAlreadyExistsError } from "./component.errors";
import type { ComponentRepository } from "./component.repository";

export class CreateComponent {
  constructor(
    private readonly components: ComponentRepository,
  ) {}

  async execute(input: CreateComponentInput): Promise<Component> {
    const sku = input.sku.trim().toLowerCase();
    const name = input.name.trim();
    const unit = input.unit.trim();

    const existing = await this.components.findBySku(sku);

    if (existing) {
      throw new ComponentSkuAlreadyExistsError(sku);
    }

    // Create the component using factory method
    return this.components.save(Component.create(input));
  }
}
