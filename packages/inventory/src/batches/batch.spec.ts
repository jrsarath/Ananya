import { describe, it, expect } from "vitest";
import { Batch } from "./batch";

describe("Batch aggregate", () => {
  it("should create a valid Batch", () => {
    const batch = Batch.create({
      componentId: "comp-1",
      batchNumber: "LOT-2026-001",
      supplierBatchNumber: "SUPP-LOT-99",
    });

    expect(batch.id).toBeDefined();
    expect(batch.batchNumber).toBe("LOT-2026-001");
    expect(batch.supplierBatchNumber).toBe("SUPP-LOT-99");
  });

  it("should throw when batch number is empty", () => {
    expect(() =>
      Batch.create({
        componentId: "comp-1",
        batchNumber: "  ",
      }),
    ).toThrow();
  });
});
