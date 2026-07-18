import { InventoryTransaction } from '../ledger/inventory-transaction';
import { InventoryProjection } from './inventory-projection';
import { TransactionType } from '../ledger/transaction-types';

export interface CalculateInventoryProjectionProps {
  componentId: string;
  locationId: string;
  transactions: InventoryTransaction[];
}

export class CalculateInventoryProjection {
  static execute({ componentId, locationId, transactions }: CalculateInventoryProjectionProps): InventoryProjection {
    // Filter transactions for this component and location
    const relevantTransactions = transactions.filter(transaction => 
      transaction.getComponentId() === componentId &&
      (transaction.getSourceLocationId() === locationId || 
       transaction.getDestinationLocationId() === locationId)
    );

    // Sort transactions by timestamp
    relevantTransactions.sort((a, b) => a.getCreatedAt().getTime() - b.getCreatedAt().getTime());

    // Calculate cumulative quantity
    let totalQuantity = 0;
    
    for (const transaction of relevantTransactions) {
      const quantity = transaction.getQuantity();
      const transactionType = transaction.getTransactionType();
      
      // Determine the effect of this transaction on inventory
      switch (transactionType) {
        case TransactionType.Receipt:
        case TransactionType.Return:
        case TransactionType.Production:
          // These increase inventory
          totalQuantity += quantity;
          break;
          
        case TransactionType.Issue:
        case TransactionType.Consumption:
          // These decrease inventory
          totalQuantity -= quantity;
          break;
          
        case TransactionType.Transfer:
          // For transfers, we need to consider source and destination
          if (transaction.getSourceLocationId() === locationId) {
            // Transfer out decreases inventory
            totalQuantity -= quantity;
          } else if (transaction.getDestinationLocationId() === locationId) {
            // Transfer in increases inventory
            totalQuantity += quantity;
          }
          // If neither source nor destination is our location, no change
          break;
          
        case TransactionType.Adjustment:
          // Adjustments can be positive or negative
          totalQuantity += quantity;
          break;
          
        default:
          // Unknown transaction type - do nothing
          break;
      }
    }

    // Create a new projection with the calculated quantity
    const projection = InventoryProjection.createFromTransaction(
      componentId,
      locationId,
      totalQuantity,
      transactions.length > 0 ? transactions[0].getUnitOfMeasure() : '',
      'Calculated',
      new Date()
    );

    return projection;
  }
}