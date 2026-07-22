export interface BatchProps {
    id: string;
    componentId: string;
    batchNumber: string;
    manufacturingDate?: Date | null;
    expiryDate?: Date | null;
    supplierBatchNumber?: string | null;
    createdAt: Date;
}
export interface CreateBatchInput {
    componentId: string;
    batchNumber: string;
    manufacturingDate?: Date | null;
    expiryDate?: Date | null;
    supplierBatchNumber?: string | null;
}
export declare class Batch {
    readonly id: string;
    readonly componentId: string;
    readonly batchNumber: string;
    readonly manufacturingDate?: Date | null;
    readonly expiryDate?: Date | null;
    readonly supplierBatchNumber?: string | null;
    readonly createdAt: Date;
    private constructor();
    static create(input: CreateBatchInput): Batch;
    static rehydrate(props: BatchProps): Batch;
}
//# sourceMappingURL=batch.d.ts.map