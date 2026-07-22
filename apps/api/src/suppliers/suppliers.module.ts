import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService, SUPPLIER_REPOSITORY } from './suppliers.service';
import { DrizzleSupplierRepository } from '../infrastructure/repositories/drizzle-supplier.repository';

@Module({
  controllers: [SuppliersController],
  providers: [
    SuppliersService,
    {
      provide: SUPPLIER_REPOSITORY,
      useClass: DrizzleSupplierRepository,
    },
  ],
  exports: [SuppliersService],
})
export class SuppliersModule {}
