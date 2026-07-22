"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessRuleError = void 0;
const domain_error_1 = require("./domain-error");
/**
 * Error thrown when an operation violates a business rule or invariant.
 */
class BusinessRuleError extends domain_error_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.BusinessRuleError = BusinessRuleError;
//# sourceMappingURL=domain-rule-violation-error.js.map