import { DomainError } from "@ananya/core";
export declare class InvalidTransactionTypeError extends DomainError {
    constructor(message: string);
}
export declare class InvalidQuantityError extends DomainError {
    constructor(message: string);
}
export declare class InvalidLocationError extends DomainError {
    constructor(message: string);
}
export declare class InventoryTransactionNotFoundError extends DomainError {
    constructor(message: string);
}
//# sourceMappingURL=inventory-transaction.errors.d.ts.map