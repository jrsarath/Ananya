import type { InventoryTransactionRepository } from "../ledger/inventory-transaction.repository";
import type { InventoryProjectionRepository } from "./inventory-projection.repository";
export interface RebuildInventoryProjectionsProps {
    transactionRepository: InventoryTransactionRepository;
    projectionRepository: InventoryProjectionRepository;
}
export declare class RebuildInventoryProjections {
    private readonly transactionRepository;
    private readonly projectionRepository;
    constructor(transactionRepository: InventoryTransactionRepository, projectionRepository: InventoryProjectionRepository);
    execute(): Promise<void>;
}
//# sourceMappingURL=rebuild-inventory-projections.d.ts.map