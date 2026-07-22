"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const core_1 = require("@ananya/core");
const reservation_types_1 = require("./reservation.types");
const reservation_errors_1 = require("./reservation.errors");
class Reservation {
    id;
    componentId;
    locationId;
    quantity;
    unitOfMeasure;
    reference;
    reservedBy;
    _status;
    createdAt;
    expiresAt;
    constructor(props) {
        this.id = props.id;
        this.componentId = props.componentId;
        this.locationId = props.locationId;
        this.quantity = props.quantity;
        this.unitOfMeasure = props.unitOfMeasure;
        this.reference = props.reference;
        this.reservedBy = props.reservedBy;
        this._status = props.status;
        this.createdAt = props.createdAt;
        this.expiresAt = props.expiresAt;
    }
    get status() {
        return this._status;
    }
    static create(input) {
        if (input.quantity <= 0) {
            throw new reservation_errors_1.InvalidReservationQuantityError();
        }
        const id = core_1.ObjectId.generate().value;
        const createdAt = new Date();
        return new Reservation({
            id,
            componentId: input.componentId,
            locationId: input.locationId,
            quantity: input.quantity,
            unitOfMeasure: input.unitOfMeasure,
            reference: input.reference,
            reservedBy: input.reservedBy,
            status: reservation_types_1.ReservationStatus.Active,
            createdAt,
            expiresAt: input.expiresAt ?? null,
        });
    }
    static rehydrate(props) {
        return new Reservation(props);
    }
    fulfill() {
        if (this._status !== reservation_types_1.ReservationStatus.Active) {
            throw new reservation_errors_1.InvalidReservationStatusError("Only active reservations can be fulfilled");
        }
        this._status = reservation_types_1.ReservationStatus.Fulfilled;
    }
    cancel() {
        if (this._status !== reservation_types_1.ReservationStatus.Active) {
            throw new reservation_errors_1.InvalidReservationStatusError("Only active reservations can be cancelled");
        }
        this._status = reservation_types_1.ReservationStatus.Cancelled;
    }
    expire() {
        if (this._status !== reservation_types_1.ReservationStatus.Active) {
            throw new reservation_errors_1.InvalidReservationStatusError("Only active reservations can expire");
        }
        this._status = reservation_types_1.ReservationStatus.Expired;
    }
}
exports.Reservation = Reservation;
//# sourceMappingURL=reservation.js.map