import { ObjectId } from '@ananya/core';
import type { SerialProps, CreateSerialProps, SerialStatus as SerialStatusType } from './batch-serial.types';
import { SERIAL_STATUS, SerialStatus } from './batch-serial.types';
import {
  InvalidComponentIdError,
  InvalidLocationIdError,
  InvalidUnitOfMeasureError,
  InvalidSerialNumberError,
  InvalidReceivedByError,
  InvalidManufactureDateError,
  SerialAlreadyConsumedError
} from './batch-serial.errors';

export class Serial {
  public readonly id: string;
  public readonly componentId: string;
  public readonly serialNumber: string;
  public readonly unitOfMeasure: string;
  public readonly locationId: string;
  public readonly status: SerialStatusType;
  public readonly manufactureDate?: Date;
  public readonly receivedBy: string;
  public readonly notes?: string;
  public readonly createdAt: Date;
  public readonly consumedAt?: Date;
  public readonly consumedBy?: string;
  public readonly lostAt?: Date;
  public readonly damagedAt?: Date;
  public readonly quarantinedAt?: Date;
  public readonly quarantinedBy?: string;
  public readonly quarantineReason?: string;

  private constructor(props: SerialProps) {
    this.id = props.id;
    this.componentId = props.componentId;
    this.serialNumber = props.serialNumber;
    this.unitOfMeasure = props.unitOfMeasure;
    this.locationId = props.locationId;
    this.status = props.status;
    this.manufactureDate = props.manufactureDate;
    this.receivedBy = props.receivedBy;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.consumedAt = props.consumedAt;
    this.consumedBy = props.consumedBy;
    this.lostAt = props.lostAt;
    this.damagedAt = props.damagedAt;
    this.quarantinedAt = props.quarantinedAt;
    this.quarantinedBy = props.quarantinedBy;
    this.quarantineReason = props.quarantineReason;
  }

  /**
   * Creates a new Serial aggregate.
   * Owns identity generation, timestamps, defaults, normalization, and invariants.
   */
  public static create(input: CreateSerialProps): Serial {
    // Validate component ID
    if (!input.componentId || input.componentId.trim() === '') {
      throw new InvalidComponentIdError('Component ID is required');
    }

    // Validate serial number
    if (!input.serialNumber || input.serialNumber.trim() === '') {
      throw new InvalidSerialNumberError('Serial number is required');
    }

    // Validate location ID
    if (!input.locationId || input.locationId.trim() === '') {
      throw new InvalidLocationIdError('Location ID is required');
    }

    // Validate unit of measure
    if (!input.unitOfMeasure || input.unitOfMeasure.trim() === '') {
      throw new InvalidUnitOfMeasureError('Unit of measure is required');
    }

    // Validate received by
    if (!input.receivedBy || input.receivedBy.trim() === '') {
      throw new InvalidReceivedByError('Received by is required');
    }

    // Validate manufacture date cannot be in the future
    if (input.manufactureDate && input.manufactureDate > new Date()) {
      throw new InvalidManufactureDateError('Manufacture date cannot be in the future');
    }

    // Generate identity and timestamps
    const id = input.id ?? ObjectId.generate().value;
    const createdAt = input.createdAt ?? new Date();

    return new Serial({
      id,
      componentId: input.componentId,
      serialNumber: input.serialNumber.trim(),
      unitOfMeasure: input.unitOfMeasure,
      locationId: input.locationId,
      status: SerialStatus.Created,
      manufactureDate: input.manufactureDate,
      receivedBy: input.receivedBy,
      notes: input.notes,
      createdAt,
    });
  }

  /**
   * Rehydrates an existing Serial from persistence.
   * Reconstructs state exactly as stored without validation or normalization.
   * Used only by repositories when loading from the database.
   */
  public static rehydrate(props: SerialProps): Serial {
    return new Serial(props);
  }

  /**
   * Activates a serial that is in Created status.
   */
  public activate(): void {
    if (this.status !== SerialStatus.Created) {
      throw new Error(
        `Only serials in 'Created' status can be activated. Current status: ${this.status}`
      );
    }
    this.status = SerialStatus.Active;
  }

  /**
   * Consumes the serial item.
   */
  public consume(consumedBy: string): void {
    if (this.status === SerialStatus.Consumed) {
      throw new SerialAlreadyConsumedError(this.serialNumber);
    }

    if (this.status === SerialStatus.Quarantined) {
      throw new Error('Cannot consume a quarantined serial item');
    }

    if (!consumedBy || consumedBy.trim() === '') {
      throw new Error('Consumed by is required');
    }

    this.status = SerialStatus.Consumed;
    this.consumedAt = new Date();
    this.consumedBy = consumedBy.trim();
  }

  /**
   * Marks the serial as lost.
   */
  public markAsLost(): void {
    if (this.status === SerialStatus.Consumed) {
      throw new Error('Consumed serials cannot be marked as lost');
    }
    this.status = SerialStatus.Lost;
    this.lostAt = new Date();
  }

  /**
   * Marks the serial as damaged.
   */
  public markAsDamaged(): void {
    if (this.status === SerialStatus.Consumed) {
      throw new Error('Consumed serials cannot be marked as damaged');
    }
    this.status = SerialStatus.Damaged;
    this.damagedAt = new Date();
  }

  /**
   * Quarantines the serial item.
   */
  public quarantine(reason: string, quarantinedBy: string): void {
    if (!reason || reason.trim() === '') {
      throw new Error('Quarantine reason is required');
    }
    if (!quarantinedBy || quarantinedBy.trim() === '') {
      throw new Error('Quarantined by is required');
    }
    if (this.status === SerialStatus.Consumed) {
      throw new Error('Consumed serials cannot be quarantined');
    }
    this.status = SerialStatus.Quarantined;
    this.quarantinedAt = new Date();
    this.quarantinedBy = quarantinedBy;
    this.quarantineReason = reason.trim();
  }

  /**
   * Releases the serial from quarantine back to Active status.
   */
  public releaseFromQuarantine(): void {
    if (this.status !== SerialStatus.Quarantined) {
      throw new Error('Only quarantined serials can be released');
    }
    this.status = SerialStatus.Active;
    this.quarantinedAt = undefined;
    this.quarantinedBy = undefined;
    this.quarantineReason = undefined;
  }

  /**
   * Checks if the serial is currently active.
   */
  public isActive(): boolean {
    return this.status === SerialStatus.Active;
  }

  /**
   * Checks if the serial has been consumed.
   */
  public isConsumed(): boolean {
    return this.status === SerialStatus.Consumed;
  }
}
