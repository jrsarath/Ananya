"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLocation = void 0;
const location_1 = require("./location");
const location_errors_1 = require("./location.errors");
class CreateLocation {
    locations;
    constructor(locations) {
        this.locations = locations;
    }
    async execute(input) {
        // Normalize input for uniqueness check (the aggregate will normalize again)
        const code = input.code.trim().toUpperCase();
        const existing = await this.locations.findByCode(code);
        if (existing) {
            throw new location_errors_1.LocationCodeAlreadyExistsError(code);
        }
        if (input.parentId) {
            const parent = await this.locations.findById(input.parentId);
            if (!parent) {
                throw new location_errors_1.ParentLocationNotFoundError(input.parentId);
            }
            if (!parent.isActive) {
                throw new location_errors_1.InactiveParentLocationError(input.parentId);
            }
        }
        // Create the location using factory method
        const location = location_1.Location.create(input);
        // Persist the aggregate
        return this.locations.save(location);
    }
}
exports.CreateLocation = CreateLocation;
//# sourceMappingURL=create-location.js.map