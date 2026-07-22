"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainError = void 0;
/**
 * Base error class for all domain errors in Ananya.
 * All domain-specific errors should extend this class.
 */
class DomainError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.DomainError = DomainError;
//# sourceMappingURL=domain-error.js.map