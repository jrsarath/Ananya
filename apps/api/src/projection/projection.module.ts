import { Module } from '@nestjs/common';
import { INVENTORY_PROJECTION_REPOSITORY } from './projection.tokens';
import { DrizzleInventoryProjectionRepository } from '../infrastructure/repositories/drizzle-inventory-projection.repository';
import { ProjectionController } from './projection.controller';
import { ProjectionService } from './projection.service';

@Module({
  controllers: [ProjectionController],
  providers: [
    ProjectionService,
    {
      provide: INVENTORY_PROJECTION_REPOSITORY,
      useClass: DrizzleInventoryProjectionRepository,
    },
  ],
  exports: [ProjectionService],
})
export class ProjectionModule {}
