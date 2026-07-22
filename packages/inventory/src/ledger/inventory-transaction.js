"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryTransaction = void 0;
const core_1 = require("@ananya/core");
const transaction_types_1 = require("./transaction-types");
const inventory_transaction_errors_1 = require("./inventory-transaction.errors");
// Helper function to ensure exhaustive switch statements
function assertNever(value) {
    throw new Error(`Unhandled transaction type: ${value}`);
}
class InventoryTransaction {
    id;
    componentId;
    quantity;
    unitOfMeasure;
    sourceLocationId;
    destinationLocationId;
    transactionType;
    reference;
    reason;
    createdBy;
    createdAt;
    constructor(props) {
        this.id = props.id;
        this.componentId = props.componentId;
        this.quantity = props.quantity;
        this.unitOfMeasure = props.unitOfMeasure;
        this.sourceLocationId = props.sourceLocationId;
        this.destinationLocationId = props.destinationLocationId;
        this.transactionType = props.transactionType;
        this.reference = props.reference;
        this.reason = props.reason;
        this.createdBy = props.createdBy;
        this.createdAt = props.createdAt;
    }
    /**
     * Creates a new InventoryTransaction aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input) {
        // Validate quantity
        if (input.quantity <= 0) {
            throw new inventory_transaction_errors_1.InvalidQuantityError("Quantity must be greater than zero");
        }
        // Validate transaction type using single source of truth
        if (!transaction_types_1.TRANSACTION_TYPES.includes(input.transactionType)) {
            throw new inventory_transaction_errors_1.InvalidTransactionTypeError("Invalid transaction type");
        }
        // Validate component
        if (!input.componentId || input.componentId.trim() === "") {
            throw new inventory_transaction_errors_1.InvalidLocationError("Component ID is required");
        }
        // Validate locations based on transaction type using exhaustive switch
        switch (input.transactionType) {
            case transaction_types_1.TransactionType.Receipt:
                if (input.sourceLocationId) {
                    throw new inventory_transaction_errors_1.InvalidLocationError("Receipt transactions may not have a source location");
                }
                break;
            case transaction_types_1.TransactionType.Issue:
                if (input.destinationLocationId) {
                    throw new inventory_transaction_errors_1.InvalidLocationError("Issue transactions may not have a destination location");
                }
                break;
            case transaction_types_1.TransactionType.Transfer:
                if (!input.sourceLocationId) {
                    throw new inventory_transaction_errors_1.InvalidLocationError("Transfer transactions require a source location");
                }
                if (!input.destinationLocationId) {
                    throw new inventory_transaction_errors_1.InvalidLocationError("Transfer transactions require a destination location");
                }
                if (input.sourceLocationId === input.destinationLocationId) {
                    throw new inventory_transaction_errors_1.InvalidLocationError("Source and destination locations cannot be identical for transfer");
                }
                break;
            case transaction_types_1.TransactionType.Adjustment:
                if (!input.sourceLocationId && !input.destinationLocationId) {
                    throw new inventory_transaction_errors_1.InvalidLocationError("Adjustment transactions require at least one location");
                }
                break;
            case transaction_types_1.TransactionType.Return:
                // Return transactions can have either source or destination location
                break;
            case transaction_types_1.TransactionType.Consumption:
                // Consumption transactions can have either source or destination location
                break;
            case transaction_types_1.TransactionType.Production:
                // Production transactions can have either source or destination location
                break;
            default:
                assertNever(input.transactionType);
        }
        // Generate identity and timestamps - factory owns these
        const id = core_1.ObjectId.generate().value;
        const createdAt = new Date();
        return new InventoryTransaction({
            id,
            componentId: input.componentId,
            quantity: input.quantity,
            unitOfMeasure: input.unitOfMeasure,
            sourceLocationId: input.sourceLocationId,
            destinationLocationId: input.destinationLocationId,
            transactionType: input.transactionType,
            reference: input.reference,
            reason: input.reason,
            createdBy: input.createdBy,
            createdAt,
        });
    }
    /**
     * Rehydrates an existing InventoryTransaction from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props) {
        return new InventoryTransaction(props);
    }
}
exports.InventoryTransaction = InventoryTransaction;
//# sourceMappingURL=inventory-transaction.js.map