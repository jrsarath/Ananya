"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manufacturer = void 0;
const core_1 = require("@ananya/core");
const manufacturer_errors_1 = require("./manufacturer.errors");
class Manufacturer {
    id;
    code;
    name;
    isActive;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.code = props.code;
        this.name = props.name;
        this.isActive = props.isActive;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    /**
     * Creates a new Manufacturer aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input) {
        // Normalize code: trim and lowercase
        const code = input.code.trim().toLowerCase();
        // Normalize name: trim
        const name = input.name.trim();
        // Validate code
        if (!code) {
            throw new manufacturer_errors_1.InvalidManufacturerCodeError("Manufacturer code is required");
        }
        // Validate name
        if (!name) {
            throw new manufacturer_errors_1.InvalidManufacturerNameError("Manufacturer name is required");
        }
        // Generate identity and timestamps
        const id = core_1.ObjectId.generate().value;
        const createdAt = new Date();
        const updatedAt = createdAt;
        return new Manufacturer({
            id,
            code,
            name,
            isActive: true, // Default to active
            createdAt,
            updatedAt,
        });
    }
    /**
     * Rehydrates an existing Manufacturer from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props) {
        return new Manufacturer(props);
    }
}
exports.Manufacturer = Manufacturer;
//# sourceMappingURL=manufacturer.js.map