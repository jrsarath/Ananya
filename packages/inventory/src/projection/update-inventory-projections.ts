import type { InventoryTransaction } from "../ledger/inventory-transaction";
import type { InventoryProjectionRepository } from "./inventory-projection.repository";
import { CalculateInventoryProjection } from "./calculate-inventory-projection";

export interface UpdateInventoryProjectionsProps {
  transaction: InventoryTransaction;
  projectionRepository: InventoryProjectionRepository;
}

export class UpdateInventoryProjections {
  constructor(
    private readonly projectionRepository: InventoryProjectionRepository,
  ) {}

  async execute({
    transaction,
  }: UpdateInventoryProjectionsProps): Promise<void> {
    const componentId = transaction.componentId;

    // Determine which locations are affected by this transaction
    const affectedLocations: string[] = [];

    if (transaction.sourceLocationId) {
      affectedLocations.push(transaction.sourceLocationId);
    }

    if (transaction.destinationLocationId) {
      affectedLocations.push(transaction.destinationLocationId);
    }

    // For each affected location, update the projection
    for (const locationId of affectedLocations) {
      try {
        const projection = CalculateInventoryProjection.execute({
          componentId,
          locationId,
          transactions: [transaction],
        });

        await this.projectionRepository.save(projection);
      } catch (error) {
        console.error(
          `Failed to update projection for component ${componentId} at location ${locationId}:`,
          error,
        );
      }
    }
  }
}
