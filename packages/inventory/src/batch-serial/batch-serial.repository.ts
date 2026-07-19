import { Batch } from './batch';
import { Serial } from './serial';
import type { FindManyBatchesOptions, FindManySerialsOptions } from './batch-serial.types';

export interface BatchRepository {
  findById(id: string): Promise<Batch | null>;
  findByBatchNumber(batchNumber: string): Promise<Batch | null>;
  findMany(options?: FindManyBatchesOptions): Promise<Batch[]>;
  save(batch: Batch): Promise<Batch>;
}

export interface SerialRepository {
  findById(id: string): Promise<Serial | null>;
  findBySerialNumber(serialNumber: string): Promise<Serial | null>;
  findMany(options?: FindManySerialsOptions): Promise<Serial[]>;
  save(serial: Serial): Promise<Serial>;
}
