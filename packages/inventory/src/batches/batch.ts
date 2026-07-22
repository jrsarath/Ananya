import { ObjectId } from "@ananya/core";

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

export class Batch {
  public readonly id: string;
  public readonly componentId: string;
  public readonly batchNumber: string;
  public readonly manufacturingDate?: Date | null;
  public readonly expiryDate?: Date | null;
  public readonly supplierBatchNumber?: string | null;
  public readonly createdAt: Date;

  private constructor(props: BatchProps) {
    this.id = props.id;
    this.componentId = props.componentId;
    this.batchNumber = props.batchNumber;
    this.manufacturingDate = props.manufacturingDate;
    this.expiryDate = props.expiryDate;
    this.supplierBatchNumber = props.supplierBatchNumber;
    this.createdAt = props.createdAt;
  }

  public static create(input: CreateBatchInput): Batch {
    if (!input.batchNumber || input.batchNumber.trim() === "") {
      throw new Error("Batch number is required");
    }
    if (!input.componentId || input.componentId.trim() === "") {
      throw new Error("Component ID is required");
    }

    const id = ObjectId.generate().value;
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

  public static rehydrate(props: BatchProps): Batch {
    return new Batch(props);
  }
}
