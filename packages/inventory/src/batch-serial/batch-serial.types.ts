import { ObjectId } from '@ananya/core';

export const BATCH_STATUS = [
  'Created',
  'Active',
  'PartiallyConsumed',
  'FullyConsumed',
  'Expired',
  'Quarantined'
] as const;

export const BatchStatus = {
  Created: BATCH_STATUS[0],
  Active: BATCH_STATUS[1],
  PartiallyConsumed: BATCH_STATUS[2],
  FullyConsumed: BATCH_STATUS[3],
  Expired: BATCH_STATUS[4],
  Quarantined: BATCH_STATUS[5]
} as const;

export type BatchStatus = typeof BATCH_STATUS[number];

export const SERIAL_STATUS = [
  'Created',
  'Active',
  'Consumed',
  'Lost',
  'Damaged',
  'Quarantined'
] as const;

export const SerialStatus = {
  Created: SERIAL_STATUS[0],
  Active: SERIAL_STATUS[1],
  Consumed: SERIAL_STATUS[2],
  Lost: SERIAL_STATUS[3],
  Damaged: SERIAL_STATUS[4],
  Quarantined: SERIAL_STATUS[5]
} as const;

export type SerialStatus = typeof SERIAL_STATUS[number];

export interface CreateBatchProps {
  id?: string;
  componentId: string;
  batchNumber: string;
  quantity: number;
  unitOfMeasure: string;
  locationId: string;
  manufactureDate?: Date;
  expiryDate?: Date;
  supplierReference?: string;
  receivedBy: string;
  notes?: string;
  createdAt?: Date;
}

export interface BatchProps {
  id: string;
  componentId: string;
  batchNumber: string;
  quantity: number;
  consumedQuantity: number;
  unitOfMeasure: string;
  locationId: string;
  status: BatchStatus;
  manufactureDate?: Date;
  expiryDate?: Date;
  supplierReference?: string;
  receivedBy: string;
  notes?: string;
  createdAt: Date;
  fullyConsumedAt?: Date;
  expiredAt?: Date;
  quarantinedAt?: Date;
  quarantinedBy?: string;
  quarantineReason?: string;
}

export interface CreateSerialProps {
  id?: string;
  componentId: string;
  serialNumber: string;
  unitOfMeasure: string;
  locationId: string;
  manufactureDate?: Date;
  receivedBy: string;
  notes?: string;
  createdAt?: Date;
}

export interface SerialProps {
  id: string;
  componentId: string;
  serialNumber: string;
  unitOfMeasure: string;
  locationId: string;
  status: SerialStatus;
  manufactureDate?: Date;
  receivedBy: string;
  notes?: string;
  createdAt: Date;
  consumedAt?: Date;
  consumedBy?: string;
  lostAt?: Date;
  damagedAt?: Date;
  quarantinedAt?: Date;
  quarantinedBy?: string;
  quarantineReason?: string;
}

export interface FindManyBatchesOptions {
  componentId?: string;
  locationId?: string;
  status?: BatchStatus;
  batchNumber?: string;
  supplierReference?: string;
}

export interface FindManySerialsOptions {
  componentId?: string;
  locationId?: string;
  status?: SerialStatus;
  serialNumber?: string;
}
