import { Module } from '@nestjs/common';
import { INVENTORY_PROJECTION_REPOSITORY } from './inventory-projection.tokens';
import { DrizzleInventoryProjectionRepository } from '../infrastructure/repositories/drizzle-inventory-projection.repository';
import { InventoryProjectionsController } from './inventory-projections.controller';
import { InventoryProjectionsService } from './inventory-projections.service';
import { InventoryTransactionsModule } from '../inventory-transactions/inventory-transactions.module';

@Module({
  imports: [InventoryTransactionsModule],
  controllers: [InventoryProjectionsController],
  providers: [
    InventoryProjectionsService,
    {
      provide: INVENTORY_PROJECTION_REPOSITORY,
      useClass: DrizzleInventoryProjectionRepository,
    },
  ],
  exports: [InventoryProjectionsService, INVENTORY_PROJECTION_REPOSITORY],
})
export class InventoryProjectionsModule {}
