import { Module } from '@nestjs/common';
import { MANUFACTURER_REPOSITORY } from './manufacturer.tokens';
import { DrizzleManufacturerRepository } from '../infrastructure/repositories/drizzle-manufacturer.repository';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';

@Module({
  controllers: [ManufacturersController],
  providers: [
    ManufacturersService,
    {
      provide: MANUFACTURER_REPOSITORY,
      useClass: DrizzleManufacturerRepository,
    },
  ],
  exports: [ManufacturersService],
})
export class ManufacturersModule {}
