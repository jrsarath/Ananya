import type { CreateReservationInput, ReservationProps } from "./reservation.types";
import { ReservationStatus } from "./reservation.types";
export declare class Reservation {
    readonly id: string;
    readonly componentId: string;
    readonly locationId: string;
    readonly quantity: number;
    readonly unitOfMeasure: string;
    readonly reference?: string;
    readonly reservedBy: string;
    private _status;
    readonly createdAt: Date;
    readonly expiresAt?: Date | null;
    private constructor();
    get status(): ReservationStatus;
    static create(input: CreateReservationInput): Reservation;
    static rehydrate(props: ReservationProps): Reservation;
    fulfill(): void;
    cancel(): void;
    expire(): void;
}
//# sourceMappingURL=reservation.d.ts.map