import type { InventoryTransactionProps, CreateInventoryTransactionProps } from "./inventory-transaction.types";
import type { TransactionType } from "./transaction-types";
export declare class InventoryTransaction {
    readonly id: string;
    readonly componentId: string;
    readonly quantity: number;
    readonly unitOfMeasure: string;
    readonly sourceLocationId?: string;
    readonly destinationLocationId?: string;
    readonly transactionType: TransactionType;
    readonly reference?: string;
    readonly reason?: string;
    readonly createdBy: string;
    readonly createdAt: Date;
    private constructor();
    /**
     * Creates a new InventoryTransaction aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input: CreateInventoryTransactionProps): InventoryTransaction;
    /**
     * Rehydrates an existing InventoryTransaction from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props: InventoryTransactionProps): InventoryTransaction;
}
//# sourceMappingURL=inventory-transaction.d.ts.map