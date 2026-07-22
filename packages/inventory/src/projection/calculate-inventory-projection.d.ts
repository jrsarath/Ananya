import { InventoryTransaction } from "../ledger/inventory-transaction";
import { InventoryProjection } from "./inventory-projection";
export interface CalculateInventoryProjectionProps {
    componentId: string;
    locationId: string;
    transactions: InventoryTransaction[];
}
export declare class CalculateInventoryProjection {
    static execute({ componentId, locationId, transactions, }: CalculateInventoryProjectionProps): InventoryProjection;
}
//# sourceMappingURL=calculate-inventory-projection.d.ts.map