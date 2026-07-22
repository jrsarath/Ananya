import { Inject, Injectable } from '@nestjs/common';
import {
  RebuildInventoryProjections,
  type InventoryProjection,
  type InventoryProjectionRepository,
  type InventoryTransactionRepository,
} from '@ananya/inventory';
import { INVENTORY_PROJECTION_REPOSITORY } from './inventory-projection.tokens';
import { INVENTORY_TRANSACTION_REPOSITORY } from '../inventory-transactions/inventory-transaction.tokens';

@Injectable()
export class InventoryProjectionsService {
  constructor(
    @Inject(INVENTORY_PROJECTION_REPOSITORY)
    private readonly projectionRepository: InventoryProjectionRepository,
    @Inject(INVENTORY_TRANSACTION_REPOSITORY)
    private readonly transactionRepository: InventoryTransactionRepository,
  ) {}

  async getByComponentAndLocation(
    componentId: string,
    locationId: string,
  ): Promise<InventoryProjection | null> {
    return this.projectionRepository.findByComponentAndLocation(
      componentId,
      locationId,
    );
  }

  async getByComponent(componentId: string): Promise<InventoryProjection[]> {
    return this.projectionRepository.findManyByComponent(componentId);
  }

  async getByLocation(locationId: string): Promise<InventoryProjection[]> {
    return this.projectionRepository.findManyByLocation(locationId);
  }

  async rebuild(): Promise<void> {
    const rebuildUseCase = new RebuildInventoryProjections(
      this.transactionRepository,
      this.projectionRepository,
    );
    await rebuildUseCase.execute();
  }
}
