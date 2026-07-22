"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateManufacturer = void 0;
const manufacturer_1 = require("./manufacturer");
const manufacturer_errors_1 = require("./manufacturer.errors");
class CreateManufacturer {
    manufacturers;
    constructor(manufacturers) {
        this.manufacturers = manufacturers;
    }
    async execute(input) {
        // Normalize input for uniqueness check (the aggregate will normalize again)
        const code = input.code.trim().toLowerCase();
        const existing = await this.manufacturers.findByCode(code);
        if (existing) {
            throw new manufacturer_errors_1.ManufacturerCodeAlreadyExistsError(code);
        }
        // Create the manufacturer using factory method
        const manufacturer = manufacturer_1.Manufacturer.create(input);
        // Persist the aggregate
        return this.manufacturers.save(manufacturer);
    }
}
exports.CreateManufacturer = CreateManufacturer;
//# sourceMappingURL=create-manufacturer.js.map