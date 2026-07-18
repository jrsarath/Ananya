import { InventoryTransactionRepository } from '../ledger/inventory-transaction.repository';
import { InventoryProjectionRepository } from './inventory-projection.repository';
import { InventoryTransaction } from '../ledger/inventory-transaction';
import { CalculateInventoryProjection } from './calculate-inventory-projection';

export interface RebuildInventoryProjectionsProps {
  transactionRepository: InventoryTransactionRepository;
  projectionRepository: InventoryProjectionRepository;
}

export class RebuildInventoryProjections {
  constructor(
    private readonly transactionRepository: InventoryTransactionRepository,
    private readonly projectionRepository: InventoryProjectionRepository
  ) {}

  async execute(): Promise<void> {
    // First, delete all existing projections
    // (In a real implementation, we'd want to be more selective)
    
    // Get all transactions
    const transactions = await this.transactionRepository.findMany();
    
    // Group transactions by component and location
    const componentLocationMap = new Map<string, InventoryTransaction[]>();
    
    for (const transaction of transactions) {
      const key = `${transaction.getComponentId()}-${transaction.getSourceLocationId() || 'none'}-${transaction.getDestinationLocationId() || 'none'}`;
      if (!componentLocationMap.has(key)) {
        componentLocationMap.set(key, []);
      }
      componentLocationMap.get(key)?.push(transaction);
    }
    
    // For each unique component/location combination, calculate the projection
    for (const [key, componentTransactions] of componentLocationMap.entries()) {
      const [componentId, sourceLocationId, destinationLocationId] = key.split('-');
      
      // We'll calculate for both source and destination locations if they exist
      const locationsToCalculate = [];
      if (sourceLocationId !== 'none') {
        locationsToCalculate.push(sourceLocationId);
      }
      if (destinationLocationId !== 'none') {
        locationsToCalculate.push(destinationLocationId);
      }
      
      // Remove duplicates
      const uniqueLocations = [...new Set(locationsToCalculate)];
      
      for (const locationId of uniqueLocations) {
        try {
          const projection = CalculateInventoryProjection.execute({
            componentId,
            locationId,
            transactions: componentTransactions
          });
          
          // Save the projection
          await this.projectionRepository.save(projection);
        } catch (error) {
          console.error(`Failed to calculate projection for component ${componentId} at location ${locationId}:`, error);
          // Continue with other projections
        }
      }
    }
  }
}