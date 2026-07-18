import { InventoryTransaction } from '../ledger/inventory-transaction';
import { InventoryProjectionRepository } from './inventory-projection.repository';
import { CalculateInventoryProjection } from './calculate-inventory-projection';
import { TransactionType } from '../ledger/transaction-types';

export interface UpdateInventoryProjectionsProps {
  transaction: InventoryTransaction;
  projectionRepository: InventoryProjectionRepository;
}

export class UpdateInventoryProjections {
  constructor(
    private readonly projectionRepository: InventoryProjectionRepository
  ) {}

  async execute({ transaction }: UpdateInventoryProjectionsProps): Promise<void> {
    const componentId = transaction.getComponentId();
    const unitOfMeasure = transaction.getUnitOfMeasure();
    const quantity = transaction.getQuantity();
    const transactionType = transaction.getTransactionType();
    
    // Determine which locations are affected by this transaction
    const affectedLocations: string[] = [];
    
    if (transaction.getSourceLocationId()) {
      affectedLocations.push(transaction.getSourceLocationId());
    }
    
    if (transaction.getDestinationLocationId()) {
      affectedLocations.push(transaction.getDestinationLocationId());
    }
    
    // For each affected location, update the projection
    for (const locationId of affectedLocations) {
      try {
        // Get all transactions for this component and location
        // (In a real implementation, we'd have a more efficient way to get these)
        // For now, we'll calculate the projection from scratch
        
        // This is a simplified approach - in practice, we'd want to be more efficient
        // and only recalculate the specific projections that are affected
        
        // Calculate the updated projection
        const projection = CalculateInventoryProjection.execute({
          componentId,
          locationId,
          transactions: [transaction] // This is a simplification - in reality we'd need all relevant transactions
        });
        
        // Save the updated projection
        await this.projectionRepository.save(projection);
      } catch (error) {
        console.error(`Failed to update projection for component ${componentId} at location ${locationId}:`, error);
        // Continue with other locations
      }
    }
  }
}