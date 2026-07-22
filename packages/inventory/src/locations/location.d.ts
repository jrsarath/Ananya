export interface LocationProps {
    id: string;
    code: string;
    name: string;
    kind: string;
    parentId: string | null;
    isActive: boolean;
    metadata: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateLocationInput {
    code: string;
    name: string;
    kind: string;
    parentId?: string | null;
    metadata?: Record<string, unknown>;
}
export declare class Location {
    readonly id: string;
    readonly code: string;
    readonly name: string;
    readonly kind: string;
    readonly parentId: string | null;
    readonly isActive: boolean;
    readonly metadata: Record<string, unknown>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    private constructor();
    /**
     * Creates a new Location aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input: CreateLocationInput): Location;
    /**
     * Rehydrates an existing Location from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props: LocationProps): Location;
}
//# sourceMappingURL=location.d.ts.map