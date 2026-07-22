"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
const core_1 = require("@ananya/core");
class Batch {
    id;
    componentId;
    batchNumber;
    manufacturingDate;
    expiryDate;
    supplierBatchNumber;
    createdAt;
    constructor(props) {
        this.id = props.id;
        this.componentId = props.componentId;
        this.batchNumber = props.batchNumber;
        this.manufacturingDate = props.manufacturingDate;
        this.expiryDate = props.expiryDate;
        this.supplierBatchNumber = props.supplierBatchNumber;
        this.createdAt = props.createdAt;
    }
    static create(input) {
        if (!input.batchNumber || input.batchNumber.trim() === "") {
            throw new Error("Batch number is required");
        }
        if (!input.componentId || input.componentId.trim() === "") {
            throw new Error("Component ID is required");
        }
        const id = core_1.ObjectId.generate().value;
        const createdAt = new Date();
        return new Batch({
            id,
            componentId: input.componentId,
            batchNumber: input.batchNumber.trim(),
            manufacturingDate: input.manufacturingDate ?? null,
            expiryDate: input.expiryDate ?? null,
            supplierBatchNumber: input.supplierBatchNumber?.trim() ?? null,
            createdAt,
        });
    }
    static rehydrate(props) {
        return new Batch(props);
    }
}
exports.Batch = Batch;
//# sourceMappingURL=batch.js.map