"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidManufacturerNameError = exports.InvalidManufacturerCodeError = exports.ManufacturerNotFoundError = exports.ManufacturerCodeAlreadyExistsError = void 0;
const core_1 = require("@ananya/core");
class ManufacturerCodeAlreadyExistsError extends core_1.DomainError {
    constructor(code) {
        super(`Manufacturer with code '${code}' already exists.`);
    }
}
exports.ManufacturerCodeAlreadyExistsError = ManufacturerCodeAlreadyExistsError;
class ManufacturerNotFoundError extends core_1.DomainError {
    constructor(id) {
        super(`Manufacturer not found: ${id}`);
    }
}
exports.ManufacturerNotFoundError = ManufacturerNotFoundError;
class InvalidManufacturerCodeError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidManufacturerCodeError = InvalidManufacturerCodeError;
class InvalidManufacturerNameError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidManufacturerNameError = InvalidManufacturerNameError;
//# sourceMappingURL=manufacturer.errors.js.map