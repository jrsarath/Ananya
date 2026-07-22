export interface UnitProps {
    id: string;
    name: string;
    category: string;
    isBaseUnit: boolean;
    conversionFactor?: number | null;
    precision: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUnitInput {
    name: string;
    category: string;
    isBaseUnit: boolean;
    conversionFactor?: number | null;
    precision: number;
}
export declare class Unit {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly isBaseUnit: boolean;
    readonly conversionFactor?: number | null;
    readonly precision: number;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    private constructor();
    /**
     * Creates a new Unit aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input: CreateUnitInput): Unit;
    /**
     * Rehydrates an existing Unit from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props: UnitProps): Unit;
    /**
     * Converts a quantity from this unit to the base unit.
     * Only applicable for non-base units with a conversion factor.
     */
    convertToBase(quantity: number): number;
    /**
     * Converts a quantity from the base unit to this unit.
     * Only applicable for non-base units with a conversion factor.
     */
    convertFromBase(quantity: number): number;
}
//# sourceMappingURL=unit.d.ts.map