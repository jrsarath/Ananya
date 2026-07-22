"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryTransactionNotFoundError = exports.InvalidLocationError = exports.InvalidQuantityError = exports.InvalidTransactionTypeError = void 0;
const core_1 = require("@ananya/core");
class InvalidTransactionTypeError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidTransactionTypeError = InvalidTransactionTypeError;
class InvalidQuantityError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidQuantityError = InvalidQuantityError;
class InvalidLocationError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InvalidLocationError = InvalidLocationError;
class InventoryTransactionNotFoundError extends core_1.DomainError {
    constructor(message) {
        super(message);
    }
}
exports.InventoryTransactionNotFoundError = InventoryTransactionNotFoundError;
//# sourceMappingURL=inventory-transaction.errors.js.map