import type { Component, CreateComponentInput } from "./component";
import {
  ComponentSkuAlreadyExistsError,
  DefaultLocationNotFoundError,
} from "./component.errors";
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

    return this.components.create({
      sku,
      name,
      description: input.description?.trim() || undefined,
      manufacturerId: input.manufacturerId ?? null,
      categoryId: input.categoryId ?? null,
      defaultLocationId: input.defaultLocationId ?? null,
      unit,
    });
  }
}
