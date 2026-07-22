import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LocationsModule } from './locations/locations.module';
import { ComponentsModule } from './components/components.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { UnitsModule } from './units/units.module';
import { InventoryTransactionsModule } from './inventory-transactions/inventory-transactions.module';
import { InventoryProjectionsModule } from './inventory-projections/inventory-projections.module';
import { ReservationsModule } from './reservations/reservations.module';
import { BatchesModule } from './batches/batches.module';
import { SerialsModule } from './serials/serials.module';

@Module({
  imports: [
    LocationsModule,
    ComponentsModule,
    ManufacturersModule,
    UnitsModule,
    InventoryTransactionsModule,
    InventoryProjectionsModule,
    ReservationsModule,
    BatchesModule,
    SerialsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
