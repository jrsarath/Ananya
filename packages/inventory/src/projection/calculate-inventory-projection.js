"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateInventoryProjection = void 0;
const inventory_projection_1 = require("./inventory-projection");
const transaction_types_1 = require("../ledger/transaction-types");
class CalculateInventoryProjection {
    static execute({ componentId, locationId, transactions, }) {
        // Filter transactions for this component and location
        const relevantTransactions = transactions.filter((transaction) => transaction.componentId === componentId &&
            (transaction.sourceLocationId === locationId ||
                transaction.destinationLocationId === locationId));
        // Sort transactions by timestamp
        relevantTransactions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        // Calculate cumulative quantity
        let totalQuantity = 0;
        for (const transaction of relevantTransactions) {
            const quantity = transaction.quantity;
            const transactionType = transaction.transactionType;
            // Determine the effect of this transaction on inventory
            switch (transactionType) {
                case transaction_types_1.TransactionType.Receipt:
                case transaction_types_1.TransactionType.Return:
                case transaction_types_1.TransactionType.Production:
                    // These increase inventory
                    totalQuantity += quantity;
                    break;
                case transaction_types_1.TransactionType.Issue:
                case transaction_types_1.TransactionType.Consumption:
                    // These decrease inventory
                    totalQuantity -= quantity;
                    break;
                case transaction_types_1.TransactionType.Transfer:
                    // For transfers, we need to consider source and destination
                    if (transaction.sourceLocationId === locationId) {
                        // Transfer out decreases inventory
                        totalQuantity -= quantity;
                    }
                    else if (transaction.destinationLocationId === locationId) {
                        // Transfer in increases inventory
                        totalQuantity += quantity;
                    }
                    // If neither source nor destination is our location, no change
                    break;
                case transaction_types_1.TransactionType.Adjustment:
                    // Adjustments can be positive or negative
                    totalQuantity += quantity;
                    break;
                default:
                    // Unknown transaction type - do nothing
                    break;
            }
        }
        const unitOfMeasure = relevantTransactions[0]?.unitOfMeasure ??
            transactions[0]?.unitOfMeasure ??
            "";
        // Create a new projection with the calculated quantity
        const projection = inventory_projection_1.InventoryProjection.createFromTransaction(componentId, locationId, totalQuantity, unitOfMeasure, "Calculated", new Date());
        return projection;
    }
}
exports.CalculateInventoryProjection = CalculateInventoryProjection;
//# sourceMappingURL=calculate-inventory-projection.js.map