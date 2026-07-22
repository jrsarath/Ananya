import { DomainError } from "@ananya/core";
export declare class InvalidReservationQuantityError extends DomainError {
    constructor(message?: string);
}
export declare class ReservationNotFoundError extends DomainError {
    constructor(id: string);
}
export declare class InvalidReservationStatusError extends DomainError {
    constructor(message?: string);
}
//# sourceMappingURL=reservation.errors.d.ts.map