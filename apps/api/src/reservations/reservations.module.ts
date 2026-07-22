import { Module } from '@nestjs/common';
import { RESERVATION_REPOSITORY } from './reservation.tokens';
import { DrizzleReservationRepository } from '../infrastructure/repositories/drizzle-reservation.repository';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { InventoryProjectionsModule } from '../inventory-projections/inventory-projections.module';

@Module({
  imports: [InventoryProjectionsModule],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    {
      provide: RESERVATION_REPOSITORY,
      useClass: DrizzleReservationRepository,
    },
  ],
  exports: [ReservationsService, RESERVATION_REPOSITORY],
})
export class ReservationsModule {}
