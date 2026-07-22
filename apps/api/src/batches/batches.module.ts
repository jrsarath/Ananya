import { Module } from '@nestjs/common';
import { BATCH_REPOSITORY } from './batch.tokens';
import { DrizzleBatchRepository } from '../infrastructure/repositories/drizzle-batch.repository';
import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';

@Module({
  controllers: [BatchesController],
  providers: [
    BatchesService,
    {
      provide: BATCH_REPOSITORY,
      useClass: DrizzleBatchRepository,
    },
  ],
  exports: [BatchesService, BATCH_REPOSITORY],
})
export class BatchesModule {}
