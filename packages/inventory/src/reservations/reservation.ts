import { ObjectId } from '@ananya/core';
import type { ReservationProps, CreateReservationProps, ReservationStatus as ReservationStatusType } from './reservation.types';
import { RESERVATION_STATUS, ReservationStatus } from './reservation.types';
import { InvalidQuantityError, InvalidReservationStatusError, InvalidComponentIdError, InvalidLocationIdError, InvalidBusinessReferenceError, InvalidReservedByError, InvalidUnitOfMeasureError, ReservationExpiryCannotBeInPastError } from './reservation.errors';

export class Reservation {
  public readonly id: string;
  public readonly componentId: string;
  public readonly quantity: number;
  public readonly unitOfMeasure: string;
  public readonly locationId: string;
  public readonly businessReference: string;
  public readonly reservedBy: string;
  public readonly status: ReservationStatusType;
  public readonly expiry?: Date;
  public readonly notes?: string;
  public readonly createdAt: Date;
  public readonly fulfilledAt?: Date;
  public readonly cancelledAt?: Date;

  private constructor(props: ReservationProps) {
    this.id = props.id;
    this.componentId = props.componentId;
    this.quantity = props.quantity;
    this.unitOfMeasure = props.unitOfMeasure;
    this.locationId = props.locationId;
    this.businessReference = props.businessReference;
    this.reservedBy = props.reservedBy;
    this.status = props.status;
    this.expiry = props.expiry;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.fulfilledAt = props.fulfilledAt;
    this.cancelledAt = props.cancelledAt;
  }

  /**
   * Creates a new Reservation aggregate.
   * Owns identity generation, timestamps, defaults, normalization, and invariants.
   */
  public static create(input: CreateReservationProps): Reservation {
    // Validate quantity
    if (input.quantity <= 0) {
      throw new InvalidQuantityError('Quantity must be greater than zero');
    }

    // Validate component ID
    if (!input.componentId || input.componentId.trim() === '') {
      throw new InvalidComponentIdError('Component ID is required');
    }

    // Validate location ID
    if (!input.locationId || input.locationId.trim() === '') {
      throw new InvalidLocationIdError('Location ID is required');
    }

    // Validate business reference
    if (!input.businessReference || input.businessReference.trim() === '') {
      throw new InvalidBusinessReferenceError('Business reference is required');
    }

    // Validate reserved by
    if (!input.reservedBy || input.reservedBy.trim() === '') {
      throw new InvalidReservedByError('Reserved by is required');
    }

    // Validate unit of measure
    if (!input.unitOfMeasure || input.unitOfMeasure.trim() === '') {
      throw new InvalidUnitOfMeasureError('Unit of measure is required');
    }

    // Validate expiry cannot be in the past
    if (input.expiry && input.expiry < new Date()) {
      throw new ReservationExpiryCannotBeInPastError('Expiry cannot be in the past');
    }

    // Generate identity and timestamps
    const id = input.id ?? ObjectId.generate().value;
    const createdAt = input.createdAt ?? new Date();
    
    return new Reservation({
      id,
      componentId: input.componentId,
      quantity: input.quantity,
      unitOfMeasure: input.unitOfMeasure,
      locationId: input.locationId,
      businessReference: input.businessReference,
      reservedBy: input.reservedBy,
      status: ReservationStatus.Created,
      expiry: input.expiry,
      notes: input.notes,
      createdAt,
    });
  }

  /**
   * Rehydrates an existing Reservation from persistence.
   * Reconstructs state exactly as stored without validation or normalization.
   * Used only by repositories when loading from the database.
   */
  public static rehydrate(props: ReservationProps): Reservation {
    return new Reservation(props);
  }

  /**
   * Activates a reservation that is in Created status.
   */
  public activate(): void {
    if (this.status !== ReservationStatus.Created) {
      throw new InvalidReservationStatusError(
        `Only reservations in 'Created' status can be activated. Current status: ${this.status}`
      );
    }
    this.status = ReservationStatus.Active;
  }

  /**
   * Fulfills an active reservation.
   */
  public fulfill(): void {
    if (this.status !== ReservationStatus.Active) {
      throw new InvalidReservationStatusError(
        `Only reservations in 'Active' status can be fulfilled. Current status: ${this.status}`
      );
    }
    this.status = ReservationStatus.Fulfilled;
    this.fulfilledAt = new Date();
  }

  /**
   * Cancels a reservation that is not already fulfilled.
   */
  public cancel(): void {
    if (this.status === ReservationStatus.Fulfilled) {
      throw new InvalidReservationStatusError(
        'Fulfilled reservations cannot be cancelled'
      );
    }
    this.status = ReservationStatus.Cancelled;
    this.cancelledAt = new Date();
  }

  /**
   * Expires a reservation that has passed its expiry date.
   */
  public expire(): void {
    if (this.status === ReservationStatus.Fulfilled || this.status === ReservationStatus.Cancelled) {
      throw new InvalidReservationStatusError(
        'Fulfilled or cancelled reservations cannot be expired'
      );
    }
    this.status = ReservationStatus.Expired;
    this.cancelledAt = new Date();
  }

  /**
   * Checks if the reservation is currently active (affects available inventory).
   */
  public isActive(): boolean {
    return this.status === ReservationStatus.Active;
  }

  /**
   * Checks if the reservation has expired based on its expiry date.
   */
  public isExpired(): boolean {
    if (!this.expiry) {
      return false;
    }
    return new Date() > this.expiry;
  }
}
