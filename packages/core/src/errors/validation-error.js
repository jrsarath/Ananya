"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const domain_error_1 = require("./domain-error");
/**
 * Generic error for when an operation fails due to invalid input.
 */
class ValidationError extends domain_error_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation-error.js.map