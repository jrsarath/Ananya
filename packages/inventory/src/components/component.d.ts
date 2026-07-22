export interface ComponentProps {
    id: string;
    sku: string;
    name: string;
    description?: string | null;
    manufacturerId?: string | null;
    categoryId?: string | null;
    defaultLocationId?: string | null;
    unit: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateComponentInput {
    sku: string;
    name: string;
    description?: string | null;
    manufacturerId?: string | null;
    categoryId?: string | null;
    defaultLocationId?: string | null;
    unit: string;
}
export interface FindManyComponentsOptions {
}
export declare class Component {
    readonly id: string;
    readonly sku: string;
    readonly name: string;
    readonly description?: string | null;
    readonly manufacturerId?: string | null;
    readonly categoryId?: string | null;
    readonly defaultLocationId?: string | null;
    readonly unit: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    private constructor();
    /**
     * Creates a new Component aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input: CreateComponentInput): Component;
    /**
     * Rehydrates an existing Component from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props: ComponentProps): Component;
}
//# sourceMappingURL=component.d.ts.map