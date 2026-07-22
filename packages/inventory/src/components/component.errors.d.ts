import { DomainError } from "@ananya/core";
export declare class ComponentSkuAlreadyExistsError extends DomainError {
    constructor(sku: string);
}
export declare class DefaultLocationNotFoundError extends DomainError {
    constructor(locationId: string);
}
export declare class ComponentNotFoundError extends DomainError {
    constructor(id: string);
}
export declare class InvalidComponentSkuError extends DomainError {
    constructor(message: string);
}
export declare class InvalidComponentNameError extends DomainError {
    constructor(message: string);
}
export declare class InvalidUnitError extends DomainError {
    constructor(message: string);
}
//# sourceMappingURL=component.errors.d.ts.map