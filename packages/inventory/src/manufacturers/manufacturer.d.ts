export interface ManufacturerProps {
    id: string;
    code: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateManufacturerInput {
    code: string;
    name: string;
}
export declare class Manufacturer {
    readonly id: string;
    readonly code: string;
    readonly name: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    private constructor();
    /**
     * Creates a new Manufacturer aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input: CreateManufacturerInput): Manufacturer;
    /**
     * Rehydrates an existing Manufacturer from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props: ManufacturerProps): Manufacturer;
}
//# sourceMappingURL=manufacturer.d.ts.map