import { DomainError } from "@ananya/core";
export declare class ManufacturerCodeAlreadyExistsError extends DomainError {
    constructor(code: string);
}
export declare class ManufacturerNotFoundError extends DomainError {
    constructor(id: string);
}
export declare class InvalidManufacturerCodeError extends DomainError {
    constructor(message: string);
}
export declare class InvalidManufacturerNameError extends DomainError {
    constructor(message: string);
}
//# sourceMappingURL=manufacturer.errors.d.ts.map