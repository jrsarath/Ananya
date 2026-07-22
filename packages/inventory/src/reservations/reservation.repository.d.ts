import type { Reservation } from "./reservation";
export interface ReservationRepository {
    findById(id: string): Promise<Reservation | null>;
    findActiveByComponentAndLocation(componentId: string, locationId: string): Promise<Reservation[]>;
    save(reservation: Reservation): Promise<Reservation>;
}
//# sourceMappingURL=reservation.repository.d.ts.map