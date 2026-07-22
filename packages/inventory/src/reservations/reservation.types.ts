export enum ReservationStatus {
  Active = "ACTIVE",
  Fulfilled = "FULFILLED",
  Cancelled = "CANCELLED",
  Expired = "EXPIRED",
}

export interface ReservationProps {
  id: string;
  componentId: string;
  locationId: string;
  quantity: number;
  unitOfMeasure: string;
  reference?: string;
  reservedBy: string;
  status: ReservationStatus;
  createdAt: Date;
  expiresAt?: Date | null;
}

export interface CreateReservationInput {
  componentId: string;
  locationId: string;
  quantity: number;
  unitOfMeasure: string;
  reference?: string;
  reservedBy: string;
  expiresAt?: Date | null;
}
