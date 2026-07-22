import { ObjectId } from "@ananya/core";
import type {
  CreateReservationInput,
  ReservationProps,
} from "./reservation.types";
import { ReservationStatus } from "./reservation.types";
import {
  InvalidReservationQuantityError,
  InvalidReservationStatusError,
} from "./reservation.errors";

export class Reservation {
  public readonly id: string;
  public readonly componentId: string;
  public readonly locationId: string;
  public readonly quantity: number;
  public readonly unitOfMeasure: string;
  public readonly reference?: string;
  public readonly reservedBy: string;
  private _status: ReservationStatus;
  public readonly createdAt: Date;
  public readonly expiresAt?: Date | null;

  private constructor(props: ReservationProps) {
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

  get status(): ReservationStatus {
    return this._status;
  }

  public static create(input: CreateReservationInput): Reservation {
    if (input.quantity <= 0) {
      throw new InvalidReservationQuantityError();
    }

    const id = ObjectId.generate().value;
    const createdAt = new Date();

    return new Reservation({
      id,
      componentId: input.componentId,
      locationId: input.locationId,
      quantity: input.quantity,
      unitOfMeasure: input.unitOfMeasure,
      reference: input.reference,
      reservedBy: input.reservedBy,
      status: ReservationStatus.Active,
      createdAt,
      expiresAt: input.expiresAt ?? null,
    });
  }

  public static rehydrate(props: ReservationProps): Reservation {
    return new Reservation(props);
  }

  public fulfill(): void {
    if (this._status !== ReservationStatus.Active) {
      throw new InvalidReservationStatusError(
        "Only active reservations can be fulfilled",
      );
    }
    this._status = ReservationStatus.Fulfilled;
  }

  public cancel(): void {
    if (this._status !== ReservationStatus.Active) {
      throw new InvalidReservationStatusError(
        "Only active reservations can be cancelled",
      );
    }
    this._status = ReservationStatus.Cancelled;
  }

  public expire(): void {
    if (this._status !== ReservationStatus.Active) {
      throw new InvalidReservationStatusError(
        "Only active reservations can expire",
      );
    }
    this._status = ReservationStatus.Expired;
  }
}
