import { DomainError } from "@ananya/core";
export declare class LocationCodeAlreadyExistsError extends DomainError {
    constructor(code: string);
}
export declare class ParentLocationNotFoundError extends DomainError {
    constructor(parentId: string);
}
export declare class InactiveParentLocationError extends DomainError {
    constructor(parentId: string);
}
export declare class LocationNotFoundError extends DomainError {
    constructor(id: string);
}
export declare class InvalidLocationCodeError extends DomainError {
    constructor(message: string);
}
export declare class InvalidLocationNameError extends DomainError {
    constructor(message: string);
}
export declare class InvalidLocationKindError extends DomainError {
    constructor(message: string);
}
//# sourceMappingURL=location.errors.d.ts.map