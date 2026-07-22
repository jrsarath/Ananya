"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const domain_error_1 = require("./domain-error");
/**
 * Error thrown when a resource is not found.
 */
class NotFoundError extends domain_error_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=not-found-error.js.map