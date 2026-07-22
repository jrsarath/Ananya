import { Module } from '@nestjs/common';
import { UNIT_REPOSITORY } from './unit.tokens';
import { DrizzleUnitRepository } from '../infrastructure/repositories/drizzle-unit.repository';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  controllers: [UnitsController],
  providers: [
    UnitsService,
    {
      provide: UNIT_REPOSITORY,
      useClass: DrizzleUnitRepository,
    },
  ],
  exports: [UnitsService],
})
export class UnitsModule {}
