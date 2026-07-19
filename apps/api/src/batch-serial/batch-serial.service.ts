import { Inject, Injectable } from '@nestjs/common';
import {
  Batch,
  Serial,
  type CreateBatchProps,
  type CreateSerialProps,
  type FindManyBatchesOptions,
  type FindManySerialsOptions,
  BatchNotFoundError,
  SerialNotFoundError,
} from '@ananya/inventory';
import { BATCH_REPOSITORY, SERIAL_REPOSITORY } from './batch-serial.tokens';
import type { BatchRepository, SerialRepository } from '@ananya/inventory';

@Injectable()
export class BatchSerialService {
  constructor(
    @Inject(BATCH_REPOSITORY)
    private readonly batchRepository: BatchRepository,
    @Inject(SERIAL_REPOSITORY)
    private readonly serialRepository: SerialRepository,
  ) {}

  async createBatch(input: CreateBatchProps): Promise<Batch> {
    const batch = Batch.create(input);
    return this.batchRepository.save(batch);
  }

  async getBatch(id: string): Promise<Batch> {
    const batch = await this.batchRepository.findById(id);
    if (!batch) {
      throw new BatchNotFoundError(id);
    }
    return batch;
  }

  async getAllBatches(options?: FindManyBatchesOptions): Promise<Batch[]> {
    return this.batchRepository.findMany(options);
  }

  async getBatchByNumber(batchNumber: string): Promise<Batch> {
    const batch = await this.batchRepository.findByBatchNumber(batchNumber);
    if (!batch) {
      throw new BatchNotFoundError(batchNumber);
    }
    return batch;
  }

  async consumeBatch(id: string, quantity: number): Promise<Batch> {
    const batch = await this.getBatch(id);
    batch.consume(quantity);
    return this.batchRepository.save(batch);
  }

  async quarantineBatch(id: string, reason: string, quarantinedBy: string): Promise<Batch> {
    const batch = await this.getBatch(id);
    batch.quarantine(reason, quarantinedBy);
    return this.batchRepository.save(batch);
  }

  async releaseBatchFromQuarantine(id: string): Promise<Batch> {
    const batch = await this.getBatch(id);
    batch.releaseFromQuarantine();
    return this.batchRepository.save(batch);
  }

  async expireBatch(id: string): Promise<Batch> {
    const batch = await this.getBatch(id);
    batch.expire();
    return this.batchRepository.save(batch);
  }

  async createSerial(input: CreateSerialProps): Promise<Serial> {
    const serial = Serial.create(input);
    return this.serialRepository.save(serial);
  }

  async getSerial(id: string): Promise<Serial> {
    const serial = await this.serialRepository.findById(id);
    if (!serial) {
      throw new SerialNotFoundError(id);
    }
    return serial;
  }

  async getAllSerials(options?: FindManySerialsOptions): Promise<Serial[]> {
    return this.serialRepository.findMany(options);
  }

  async getSerialByNumber(serialNumber: string): Promise<Serial> {
    const serial = await this.serialRepository.findBySerialNumber(serialNumber);
    if (!serial) {
      throw new SerialNotFoundError(serialNumber);
    }
    return serial;
  }

  async consumeSerial(id: string, consumedBy: string): Promise<Serial> {
    const serial = await this.getSerial(id);
    serial.consume(consumedBy);
    return this.serialRepository.save(serial);
  }

  async markSerialAsLost(id: string): Promise<Serial> {
    const serial = await this.getSerial(id);
    serial.markAsLost();
    return this.serialRepository.save(serial);
  }

  async markSerialAsDamaged(id: string): Promise<Serial> {
    const serial = await this.getSerial(id);
    serial.markAsDamaged();
    return this.serialRepository.save(serial);
  }

  async quarantineSerial(id: string, reason: string, quarantinedBy: string): Promise<Serial> {
    const serial = await this.getSerial(id);
    serial.quarantine(reason, quarantinedBy);
    return this.serialRepository.save(serial);
  }

  async releaseSerialFromQuarantine(id: string): Promise<Serial> {
    const serial = await this.getSerial(id);
    serial.releaseFromQuarantine();
    return this.serialRepository.save(serial);
  }
}
