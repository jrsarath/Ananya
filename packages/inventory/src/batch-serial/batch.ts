import { ObjectId } from '@ananya/core';
import type { BatchProps, CreateBatchProps, BatchStatus as BatchStatusType } from './batch-serial.types';
import { BATCH_STATUS, BatchStatus } from './batch-serial.types';
import {
  InvalidQuantityError,
  InvalidComponentIdError,
  InvalidLocationIdError,
  InvalidUnitOfMeasureError,
  InvalidBatchNumberError,
  InvalidReceivedByError,
  InvalidExpiryDateError,
  InvalidManufactureDateError,
  BatchAlreadyConsumedError
} from './batch-serial.errors';

export class Batch {
  public readonly id: string;
  public readonly componentId: string;
  public readonly batchNumber: string;
  public readonly quantity: number;
  public readonly consumedQuantity: number;
  public readonly unitOfMeasure: string;
  public readonly locationId: string;
  public readonly status: BatchStatusType;
  public readonly manufactureDate?: Date;
  public readonly expiryDate?: Date;
  public readonly supplierReference?: string;
  public readonly receivedBy: string;
  public readonly notes?: string;
  public readonly createdAt: Date;
  public readonly fullyConsumedAt?: Date;
  public readonly expiredAt?: Date;
  public readonly quarantinedAt?: Date;
  public readonly quarantinedBy?: string;
  public readonly quarantineReason?: string;

  private constructor(props: BatchProps) {
    this.id = props.id;
    this.componentId = props.componentId;
    this.batchNumber = props.batchNumber;
    this.quantity = props.quantity;
    this.consumedQuantity = props.consumedQuantity;
    this.unitOfMeasure = props.unitOfMeasure;
    this.locationId = props.locationId;
    this.status = props.status;
    this.manufactureDate = props.manufactureDate;
    this.expiryDate = props.expiryDate;
    this.supplierReference = props.supplierReference;
    this.receivedBy = props.receivedBy;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.fullyConsumedAt = props.fullyConsumedAt;
    this.expiredAt = props.expiredAt;
    this.quarantinedAt = props.quarantinedAt;
    this.quarantinedBy = props.quarantinedBy;
    this.quarantineReason = props.quarantineReason;
  }

  /**
   * Creates a new Batch aggregate.
   * Owns identity generation, timestamps, defaults, normalization, and invariants.
   */
  public static create(input: CreateBatchProps): Batch {
    // Validate quantity
    if (input.quantity <= 0) {
      throw new InvalidQuantityError('Quantity must be greater than zero');
    }

    // Validate component ID
    if (!input.componentId || input.componentId.trim() === '') {
      throw new InvalidComponentIdError('Component ID is required');
    }

    // Validate batch number
    if (!input.batchNumber || input.batchNumber.trim() === '') {
      throw new InvalidBatchNumberError('Batch number is required');
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

    // Validate expiry date cannot be in the past
    if (input.expiryDate && input.expiryDate < new Date()) {
      throw new InvalidExpiryDateError('Expiry date cannot be in the past');
    }

    // Validate expiry date must be after manufacture date if both provided
    if (input.manufactureDate && input.expiryDate && input.expiryDate <= input.manufactureDate) {
      throw new InvalidExpiryDateError('Expiry date must be after manufacture date');
    }

    // Generate identity and timestamps
    const id = input.id ?? ObjectId.generate().value;
    const createdAt = input.createdAt ?? new Date();

    return new Batch({
      id,
      componentId: input.componentId,
      batchNumber: input.batchNumber.trim(),
      quantity: input.quantity,
      consumedQuantity: 0,
      unitOfMeasure: input.unitOfMeasure,
      locationId: input.locationId,
      status: BatchStatus.Created,
      manufactureDate: input.manufactureDate,
      expiryDate: input.expiryDate,
      supplierReference: input.supplierReference,
      receivedBy: input.receivedBy,
      notes: input.notes,
      createdAt,
    });
  }

  /**
   * Rehydrates an existing Batch from persistence.
   * Reconstructs state exactly as stored without validation or normalization.
   * Used only by repositories when loading from the database.
   */
  public static rehydrate(props: BatchProps): Batch {
    return new Batch(props);
  }

  /**
   * Activates a batch that is in Created status.
   */
  public activate(): void {
    if (this.status !== BatchStatus.Created) {
      throw new Error(
        `Only batches in 'Created' status can be activated. Current status: ${this.status}`
      );
    }
    this.status = BatchStatus.Active;
  }

  /**
   * Consumes a quantity from the batch.
   */
  public consume(quantity: number): void {
    if (this.status === BatchStatus.FullyConsumed) {
      throw new BatchAlreadyConsumedError('This batch has already been fully consumed');
    }

    if (this.status === BatchStatus.Quarantined) {
      throw new Error('Cannot consume from a quarantined batch');
    }

    const remainingQuantity = this.quantity - this.consumedQuantity;
    
    if (quantity <= 0) {
      throw new InvalidQuantityError('Consumption quantity must be greater than zero');
    }

    if (quantity > remainingQuantity) {
      throw new InvalidQuantityError(
        `Cannot consume ${quantity}. Only ${remainingQuantity} available in batch`
      );
    }

    this.consumedQuantity += quantity;

    if (this.consumedQuantity >= this.quantity) {
      this.status = BatchStatus.FullyConsumed;
      this.fullyConsumedAt = new Date();
    } else if (this.consumedQuantity > 0) {
      this.status = BatchStatus.PartiallyConsumed;
    }
  }

  /**
   * Marks the batch as expired.
   */
  public expire(): void {
    if (this.status === BatchStatus.FullyConsumed || this.status === BatchStatus.Quarantined) {
      throw new Error('Fully consumed or quarantined batches cannot be expired');
    }
    this.status = BatchStatus.Expired;
    this.expiredAt = new Date();
  }

  /**
   * Quarantines the batch.
   */
  public quarantine(reason: string, quarantinedBy: string): void {
    if (!reason || reason.trim() === '') {
      throw new Error('Quarantine reason is required');
    }
    if (!quarantinedBy || quarantinedBy.trim() === '') {
      throw new Error('Quarantined by is required');
    }
    this.status = BatchStatus.Quarantined;
    this.quarantinedAt = new Date();
    this.quarantinedBy = quarantinedBy;
    this.quarantineReason = reason.trim();
  }

  /**
   * Releases the batch from quarantine back to Active status.
   */
  public releaseFromQuarantine(): void {
    if (this.status !== BatchStatus.Quarantined) {
      throw new Error('Only quarantined batches can be released');
    }
    this.status = BatchStatus.Active;
    this.quarantinedAt = undefined;
    this.quarantinedBy = undefined;
    this.quarantineReason = undefined;
  }

  /**
   * Gets the available quantity in the batch.
   */
  public getAvailableQuantity(): number {
    return this.quantity - this.consumedQuantity;
  }

  /**
   * Checks if the batch is currently active.
   */
  public isActive(): boolean {
    return this.status === BatchStatus.Active || this.status === BatchStatus.PartiallyConsumed;
  }

  /**
   * Checks if the batch has expired based on its expiry date.
   */
  public isExpired(): boolean {
    if (!this.expiryDate) {
      return false;
    }
    return new Date() > this.expiryDate;
  }
}
