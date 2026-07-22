import { Inject, Injectable } from '@nestjs/common';
import {
  Batch,
  type BatchRepository,
  type CreateBatchInput,
} from '@ananya/inventory';
import { BATCH_REPOSITORY } from './batch.tokens';

@Injectable()
export class BatchesService {
  constructor(
    @Inject(BATCH_REPOSITORY)
    private readonly repository: BatchRepository,
  ) {}

  async create(input: CreateBatchInput): Promise<Batch> {
    const batch = Batch.create(input);
    return this.repository.save(batch);
  }

  async getByComponent(componentId: string): Promise<Batch[]> {
    return this.repository.findManyByComponent(componentId);
  }

  async getById(id: string): Promise<Batch | null> {
    return this.repository.findById(id);
  }
}
