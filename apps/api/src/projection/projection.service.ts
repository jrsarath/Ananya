import { Inject, Injectable } from '@nestjs/common';
import {
  InventoryProjection,
  type InventoryProjectionRepository,
  CalculateInventoryProjection,
} from '@ananya/inventory';
import { INVENTORY_PROJECTION_REPOSITORY } from './projection.tokens';

@Injectable()
export class ProjectionService {
  constructor(
    @Inject(INVENTORY_PROJECTION_REPOSITORY)
    private readonly repository: InventoryProjectionRepository,
  ) {}

  async getProjection(id: string): Promise<InventoryProjection | null> {
    return this.repository.findById(id);
  }

  async getProjectionByComponentAndLocation(
    componentId: string,
    locationId: string,
  ): Promise<InventoryProjection | null> {
    return this.repository.findByComponentAndLocation(componentId, locationId);
  }

  async getProjectionsByComponent(componentId: string): Promise<InventoryProjection[]> {
    return this.repository.findManyByComponent(componentId);
  }

  async getProjectionsByLocation(locationId: string): Promise<InventoryProjection[]> {
    return this.repository.findManyByLocation(locationId);
  }

  async recalculateProjection(
    componentId: string,
    locationId: string,
    transactions: any[],
  ): Promise<InventoryProjection> {
    const projection = CalculateInventoryProjection.execute({
      componentId,
      locationId,
      transactions,
    });
    return this.repository.save(projection);
  }

  async deleteProjection(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async deleteProjectionByComponentAndLocation(
    componentId: string,
    locationId: string,
  ): Promise<void> {
    return this.repository.deleteByComponentAndLocation(componentId, locationId);
  }
}
