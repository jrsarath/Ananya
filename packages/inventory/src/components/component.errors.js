"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUnitError = exports.InvalidComponentNameError = exports.InvalidComponentSkuError = exports.ComponentNotFoundError = exports.DefaultLocationNotFoundError = exports.ComponentSkuAlreadyExistsError = void 0;
const core_1 = require("@ananya/core");
class ComponentSkuAlreadyExistsError extends core_1.DomainError {
    constructor(sku) {
        super(`Component with SKU '${sku}' already exists.`);
    }
}
exports.ComponentSkuAlreadyExistsError = ComponentSkuAlreadyExistsError;
class DefaultLocationNotFoundError extends core_1.DomainError {
    constructor(locationId) {
        super(`Default location with ID '${locationId}' not found.`);
    }
}
exports.DefaultLocationNotFoundError = DefaultLocationNotFoundError;
class ComponentNotFoundError extends core_1.DomainError {
    constructor(id) {
        super(`Component not found: ${id}`);
    }
}
exports.ComponentNotFoundError = ComponentNotFoundError;
class InvalidComponentSkuError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidComponentSkuError = InvalidComponentSkuError;
class InvalidComponentNameError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidComponentNameError = InvalidComponentNameError;
class InvalidUnitError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidUnitError = InvalidUnitError;
//# sourceMappingURL=component.errors.js.map