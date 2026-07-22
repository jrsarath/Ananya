"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidLocationKindError = exports.InvalidLocationNameError = exports.InvalidLocationCodeError = exports.LocationNotFoundError = exports.InactiveParentLocationError = exports.ParentLocationNotFoundError = exports.LocationCodeAlreadyExistsError = void 0;
const core_1 = require("@ananya/core");
class LocationCodeAlreadyExistsError extends core_1.DomainError {
    constructor(code) {
        super(`Location with code '${code}' already exists.`);
    }
}
exports.LocationCodeAlreadyExistsError = LocationCodeAlreadyExistsError;
class ParentLocationNotFoundError extends core_1.DomainError {
    constructor(parentId) {
        super(`Parent location not found: ${parentId}`);
    }
}
exports.ParentLocationNotFoundError = ParentLocationNotFoundError;
class InactiveParentLocationError extends core_1.DomainError {
    constructor(parentId) {
        super(`Cannot create a location under inactive parent: ${parentId}`);
    }
}
exports.InactiveParentLocationError = InactiveParentLocationError;
class LocationNotFoundError extends core_1.DomainError {
    constructor(id) {
        super(`Location not found: ${id}`);
    }
}
exports.LocationNotFoundError = LocationNotFoundError;
class InvalidLocationCodeError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidLocationCodeError = InvalidLocationCodeError;
class InvalidLocationNameError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidLocationNameError = InvalidLocationNameError;
class InvalidLocationKindError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidLocationKindError = InvalidLocationKindError;
//# sourceMappingURL=location.errors.js.map