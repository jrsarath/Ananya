"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const core_1 = require("@ananya/core");
const component_errors_1 = require("./component.errors");
class Component {
    id;
    sku;
    name;
    description;
    manufacturerId;
    categoryId;
    defaultLocationId;
    unit;
    isActive;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.sku = props.sku;
        this.name = props.name;
        this.description = props.description;
        this.manufacturerId = props.manufacturerId;
        this.categoryId = props.categoryId;
        this.defaultLocationId = props.defaultLocationId;
        this.unit = props.unit;
        this.isActive = props.isActive;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    /**
     * Creates a new Component aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input) {
        // Normalize SKU: trim and lowercase
        const sku = input.sku.trim().toLowerCase();
        // Normalize name: trim
        const name = input.name.trim();
        // Normalize unit: trim
        const unit = input.unit.trim();
        // Validate required fields
        if (!sku) {
            throw new component_errors_1.InvalidComponentSkuError("SKU is required");
        }
        if (!name) {
            throw new component_errors_1.InvalidComponentNameError("Name is required");
        }
        if (!unit) {
            throw new component_errors_1.InvalidUnitError("Unit is required");
        }
        // Generate identity and timestamps
        const id = core_1.ObjectId.generate().value;
        const createdAt = new Date();
        const updatedAt = createdAt;
        return new Component({
            id,
            sku,
            name,
            description: input.description?.trim() ?? null,
            manufacturerId: input.manufacturerId ?? null,
            categoryId: input.categoryId ?? null,
            defaultLocationId: input.defaultLocationId ?? null,
            unit,
            isActive: true, // Default to active
            createdAt,
            updatedAt,
        });
    }
    /**
     * Rehydrates an existing Component from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props) {
        return new Component(props);
    }
}
exports.Component = Component;
//# sourceMappingURL=component.js.map