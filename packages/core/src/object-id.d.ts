/**
 * A value object representing a unique identifier for domain entities.
 * This ensures type safety and prevents confusion between different types of IDs.
 */
export declare class ObjectId {
    private readonly _value;
    constructor(value: string);
    /**
     * Gets the underlying string value of the ObjectId.
     */
    get value(): string;
    /**
     * Creates a new ObjectId from a string value.
     */
    static create(value: string): ObjectId;
    /**
     * Creates a new ObjectId with a random UUID.
     */
    static generate(): ObjectId;
    /**
     * Checks if this ObjectId is equal to another.
     */
    equals(other: ObjectId | null | undefined): boolean;
    /**
     * Returns the string representation of this ObjectId.
     */
    toString(): string;
}
//# sourceMappingURL=object-id.d.ts.map