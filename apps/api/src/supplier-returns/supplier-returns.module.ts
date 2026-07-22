import { Module } from '@nestjs/common';
import { SupplierReturnsController } from './supplier-returns.controller';
import {
  SupplierReturnsService,
  SUPPLIER_RETURN_REPOSITORY,
} from './supplier-returns.service';
import { DrizzleSupplierReturnRepository } from '../infrastructure/repositories/drizzle-supplier-return.repository';
import { InventoryTransactionsModule } from '../inventory-transactions/inventory-transactions.module';
import { InventoryProjectionsModule } from '../inventory-projections/inventory-projections.module';

@Module({
  imports: [InventoryTransactionsModule, InventoryProjectionsModule],
  controllers: [SupplierReturnsController],
  providers: [
    SupplierReturnsService,
    {
      provide: SUPPLIER_RETURN_REPOSITORY,
      useClass: DrizzleSupplierReturnRepository,
    },
  ],
  exports: [SupplierReturnsService],
})
export class SupplierReturnsModule {}
