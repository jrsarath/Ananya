import { Module } from '@nestjs/common';
import { SERIAL_REPOSITORY } from './serial.tokens';
import { DrizzleSerialRepository } from '../infrastructure/repositories/drizzle-serial.repository';
import { SerialsController } from './serials.controller';
import { SerialsService } from './serials.service';

@Module({
  controllers: [SerialsController],
  providers: [
    SerialsService,
    {
      provide: SERIAL_REPOSITORY,
      useClass: DrizzleSerialRepository,
    },
  ],
  exports: [SerialsService, SERIAL_REPOSITORY],
})
export class SerialsModule {}
