"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidReservationStatusError = exports.ReservationNotFoundError = exports.InvalidReservationQuantityError = void 0;
const core_1 = require("@ananya/core");
class InvalidReservationQuantityError extends core_1.DomainError {
    constructor(message = "Reservation quantity must be greater than zero") {
        super(message);
    }
}
exports.InvalidReservationQuantityError = InvalidReservationQuantityError;
class ReservationNotFoundError extends core_1.DomainError {
    constructor(id) {
        super(`Reservation with ID ${id} not found`);
    }
}
exports.ReservationNotFoundError = ReservationNotFoundError;
class InvalidReservationStatusError extends core_1.DomainError {
    constructor(message = "Invalid reservation status transition") {
        super(message);
    }
}
exports.InvalidReservationStatusError = InvalidReservationStatusError;
//# sourceMappingURL=reservation.errors.js.map