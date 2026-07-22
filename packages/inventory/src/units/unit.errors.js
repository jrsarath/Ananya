"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUnitCategoryError = exports.InvalidUnitNameError = exports.UnitNotFoundError = exports.UnitNameAlreadyExistsError = void 0;
const core_1 = require("@ananya/core");
class UnitNameAlreadyExistsError extends core_1.DomainError {
    constructor(name) {
        super(`Unit with name '${name}' already exists.`);
    }
}
exports.UnitNameAlreadyExistsError = UnitNameAlreadyExistsError;
class UnitNotFoundError extends core_1.DomainError {
    constructor(id) {
        super(`Unit not found: ${id}`);
    }
}
exports.UnitNotFoundError = UnitNotFoundError;
class InvalidUnitNameError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidUnitNameError = InvalidUnitNameError;
class InvalidUnitCategoryError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidUnitCategoryError = InvalidUnitCategoryError;
//# sourceMappingURL=unit.errors.js.map