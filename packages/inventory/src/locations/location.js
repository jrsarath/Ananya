"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const core_1 = require("@ananya/core");
const location_errors_1 = require("./location.errors");
class Location {
    id;
    code;
    name;
    kind;
    parentId;
    isActive;
    metadata;
    createdAt;
    updatedAt;
    constructor(props) {
        this.id = props.id;
        this.code = props.code;
        this.name = props.name;
        this.kind = props.kind;
        this.parentId = props.parentId;
        this.isActive = props.isActive;
        this.metadata = props.metadata;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
    /**
     * Creates a new Location aggregate.
     * Owns identity generation, timestamps, defaults, normalization, and invariants.
     */
    static create(input) {
        // Normalize code: trim and uppercase
        const code = input.code.trim().toUpperCase();
        // Normalize name: trim
        const name = input.name.trim();
        // Normalize kind: trim and lowercase
        const kind = input.kind.trim().toLowerCase();
        // Validate code
        if (!code) {
            throw new location_errors_1.InvalidLocationCodeError("Location code is required");
        }
        // Validate name
        if (!name) {
            throw new location_errors_1.InvalidLocationNameError("Location name is required");
        }
        // Validate kind
        if (!kind) {
            throw new location_errors_1.InvalidLocationKindError("Location kind is required");
        }
        // Generate identity and timestamps
        const id = core_1.ObjectId.generate().value;
        const createdAt = new Date();
        const updatedAt = createdAt;
        return new Location({
            id,
            code,
            name,
            kind,
            parentId: input.parentId ?? null,
            isActive: true, // Default to active
            metadata: input.metadata ?? {},
            createdAt,
            updatedAt,
        });
    }
    /**
     * Rehydrates an existing Location from persistence.
     * Reconstructs state exactly as stored without validation or normalization.
     * Used only by repositories when loading from the database.
     */
    static rehydrate(props) {
        return new Location(props);
    }
}
exports.Location = Location;
//# sourceMappingURL=location.js.map