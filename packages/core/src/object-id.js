"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectId = void 0;
/**
 * A value object representing a unique identifier for domain entities.
 * This ensures type safety and prevents confusion between different types of IDs.
 */
class ObjectId {
    _value;
    constructor(value) {
        if (!value || typeof value !== "string") {
            throw new Error("ObjectId must be a non-empty string");
        }
        this._value = value;
    }
    /**
     * Gets the underlying string value of the ObjectId.
     */
    get value() {
        return this._value;
    }
    /**
     * Creates a new ObjectId from a string value.
     */
    static create(value) {
        return new ObjectId(value);
    }
    /**
     * Creates a new ObjectId with a random UUID.
     */
    static generate() {
        return new ObjectId(crypto.randomUUID());
    }
    /**
     * Checks if this ObjectId is equal to another.
     */
    equals(other) {
        if (!other)
            return false;
        return this._value === other._value;
    }
    /**
     * Returns the string representation of this ObjectId.
     */
    toString() {
        return this._value;
    }
}
exports.ObjectId = ObjectId;
//# sourceMappingURL=object-id.js.map