export interface InventoryProjectionProps {
    id: string;
    componentId: string;
    locationId: string;
    quantity: number;
    unitOfMeasure: string;
    lastUpdated: Date;
}
export declare class InventoryProjection {
    readonly id: string;
    readonly componentId: string;
    readonly locationId: string;
    readonly quantity: number;
    readonly unitOfMeasure: string;
    readonly lastUpdated: Date;
    private constructor();
    static create(props: InventoryProjectionProps): InventoryProjection;
    static createFromTransaction(componentId: string, locationId: string, quantity: number, unitOfMeasure: string, transactionType: string, timestamp: Date): InventoryProjection;
    getId(): string;
    getComponentId(): string;
    getLocationId(): string;
    getQuantity(): number;
    getUnitOfMeasure(): string;
    getLastUpdated(): Date;
}
//# sourceMappingURL=inventory-projection.d.ts.map