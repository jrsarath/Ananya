/**
 * A value object representing a unique identifier for domain entities.
 * This ensures type safety and prevents confusion between different types of IDs.
 */
export class ObjectId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('ObjectId must be a non-empty string');
    }
    this._value = value;
  }

  /**
   * Gets the underlying string value of the ObjectId.
   */
  get value(): string {
    return this._value;
  }

  /**
   * Creates a new ObjectId from a string value.
   */
  static create(value: string): ObjectId {
    return new ObjectId(value);
  }

  /**
   * Creates a new ObjectId with a random UUID.
   */
  static generate(): ObjectId {
    return new ObjectId(crypto.randomUUID());
  }

  /**
   * Checks if this ObjectId is equal to another.
   */
  equals(other: ObjectId | null | undefined): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  /**
   * Returns the string representation of this ObjectId.
   */
  toString(): string {
    return this._value;
  }
}