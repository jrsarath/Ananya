import { ObjectId } from '@ananya/core';

export const RESERVATION_STATUS = [
  'Created',
  'Active',
  'Fulfilled',
  'Cancelled',
  'Expired'
] as const;

export const ReservationStatus = {
  Created: RESERVATION_STATUS[0],
  Active: RESERVATION_STATUS[1],
  Fulfilled: RESERVATION_STATUS[2],
  Cancelled: RESERVATION_STATUS[3],
  Expired: RESERVATION_STATUS[4]
} as const;

export type ReservationStatus = typeof RESERVATION_STATUS[number];

export interface CreateReservationProps {
  id?: string;
  componentId: string;
  quantity: number;
  unitOfMeasure: string;
  locationId: string;
  businessReference: string;
  reservedBy: string;
  expiry?: Date;
  notes?: string;
  createdAt?: Date;
}

export interface ReservationProps {
  id: string;
  componentId: string;
  quantity: number;
  unitOfMeasure: string;
  locationId: string;
  businessReference: string;
  reservedBy: string;
  status: ReservationStatus;
  expiry?: Date;
  notes?: string;
  createdAt: Date;
  fulfilledAt?: Date;
  cancelledAt?: Date;
}

export interface FindManyReservationsOptions {
  componentId?: string;
  locationId?: string;
  status?: ReservationStatus;
  businessReference?: string;
}
