"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const core_1 = require("@ananya/core");
const unit_errors_1 = require("./unit.errors");
class Unit {
    id;
    name;
    category;
    isBaseUnit;
    conversionFactor;
    precision;
    isActive;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.name = props.name;
        this.category = props.category;
        this.isBaseUnit = props.isBaseUnit;
        this.conversionFactor = props.conversionFactor;
        this.precision = props.precision;
        this.isActive = props.isActive;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    /**
     * Creates a new Unit aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input) {
        // Normalize name: trim
        const name = input.name.trim();
        // Normalize category: trim
        const category = input.category.trim();
        // Validate required fields
        if (!name) {
            throw new unit_errors_1.InvalidUnitNameError("Unit name is required");
        }
        if (!category) {
            throw new unit_errors_1.InvalidUnitCategoryError("Unit category is required");
        }
        // Validate conversion factor for non-base units
        if (!input.isBaseUnit &&
            (input.conversionFactor === undefined || input.conversionFactor === null)) {
            throw new unit_errors_1.InvalidUnitCategoryError("Non-base units must have a conversion factor");
        }
        // Validate conversion factor is positive
        if (input.conversionFactor !== undefined &&
            input.conversionFactor !== null &&
            input.conversionFactor <= 0) {
            throw new unit_errors_1.InvalidUnitCategoryError("Conversion factor must be greater than zero");
        }
        // Generate identity and timestamps
        const id = core_1.ObjectId.generate().value;
        const createdAt = new Date();
        const updatedAt = createdAt;
        return new Unit({
            id,
            name,
            category,
            isBaseUnit: input.isBaseUnit,
            conversionFactor: input.conversionFactor,
            precision: input.precision,
            isActive: true, // Default to active
            createdAt,
            updatedAt,
        });
    }
    /**
     * Rehydrates an existing Unit from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props) {
        return new Unit(props);
    }
    /**
     * Converts a quantity from this unit to the base unit.
     * Only applicable for non-base units with a conversion factor.
     */
    convertToBase(quantity) {
        if (this.isBaseUnit) {
            return quantity;
        }
        if (this.conversionFactor === undefined || this.conversionFactor === null) {
            throw new Error(`Cannot convert from ${this.name}: no conversion factor defined`);
        }
        return quantity * this.conversionFactor;
    }
    /**
     * Converts a quantity from the base unit to this unit.
     * Only applicable for non-base units with a conversion factor.
     */
    convertFromBase(quantity) {
        if (this.isBaseUnit) {
            return quantity;
        }
        if (this.conversionFactor === undefined || this.conversionFactor === null) {
            throw new Error(`Cannot convert to ${this.name}: no conversion factor defined`);
        }
        return quantity / this.conversionFactor;
    }
}
exports.Unit = Unit;
//# sourceMappingURL=unit.js.map