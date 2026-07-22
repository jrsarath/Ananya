import { DomainError } from "@ananya/core";
export declare class UnitNameAlreadyExistsError extends DomainError {
    constructor(name: string);
}
export declare class UnitNotFoundError extends DomainError {
    constructor(id: string);
}
export declare class InvalidUnitNameError extends DomainError {
    constructor(message: string);
}
export declare class InvalidUnitCategoryError extends DomainError {
    constructor(message: string);
}
//# sourceMappingURL=unit.errors.d.ts.map