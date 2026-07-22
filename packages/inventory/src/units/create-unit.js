"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUnit = void 0;
const unit_1 = require("./unit");
const unit_errors_1 = require("./unit.errors");
class CreateUnit {
    units;
    constructor(units) {
        this.units = units;
    }
    async execute(input) {
        // Normalize input for uniqueness check (the aggregate will normalize again)
        const name = input.name.trim();
        const existing = await this.units.findByName(name);
        if (existing) {
            throw new unit_errors_1.UnitNameAlreadyExistsError(name);
        }
        // Create the unit using factory method
        const unit = unit_1.Unit.create(input);
        // Persist the aggregate
        return this.units.save(unit);
    }
}
exports.CreateUnit = CreateUnit;
//# sourceMappingURL=create-unit.js.map