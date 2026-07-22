import type { Batch } from "./batch";
export interface BatchRepository {
    findById(id: string): Promise<Batch | null>;
    findByBatchNumber(componentId: string, batchNumber: string): Promise<Batch | null>;
    findManyByComponent(componentId: string): Promise<Batch[]>;
    save(batch: Batch): Promise<Batch>;
}
//# sourceMappingURL=batch.repository.d.ts.map