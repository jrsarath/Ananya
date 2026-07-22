import type { InventoryTransaction } from "../ledger/inventory-transaction";
import type { InventoryProjectionRepository } from "./inventory-projection.repository";
export interface UpdateInventoryProjectionsProps {
    transaction: InventoryTransaction;
    projectionRepository: InventoryProjectionRepository;
}
export declare class UpdateInventoryProjections {
    private readonly projectionRepository;
    constructor(projectionRepository: InventoryProjectionRepository);
    execute({ transaction, }: UpdateInventoryProjectionsProps): Promise<void>;
}
//# sourceMappingURL=update-inventory-projections.d.ts.map