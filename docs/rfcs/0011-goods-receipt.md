# RFC-0011: Goods Receipt

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-22

---

# 1. Purpose

This RFC defines the **Goods Receipt** aggregate, receiving workflow, and cross-domain integration between Procurement and Inventory. A Goods Receipt records the physical arrival, inspection, and formal acceptance of components delivered by a vendor against an open Purchase Order.

---

# 2. Scope

- Receiving workflow (Partial receipts, Full receipts, Over-receipt validation).
- Goods Receipt Lines with destination physical location, batch allocation, and serial allocation.
- Cross-domain invocation of `@ananya/inventory` Application Services to log immutable ledger transactions and update stock projections.

---

# 3. Ubiquitous Language

- **Goods Receipt (GR)**: Physical receiving document.
- **GR Number**: Unique human-readable document number (e.g. `GR-2026-0001`).
- **Received Line Item**: Line item specifying component, quantity received, quantity rejected, destination location ID, batch number, serial numbers.
- **Stock Receipt Transaction**: The immutable inventory transaction generated in `@ananya/inventory` upon posted receipt.

---

# 4. Domain Model

```
+--------------------------------------------------------------------+
|                      Goods Receipt Aggregate                       |
|                                                                    |
| [Goods Receipt ID] (PK)                                            |
|  - grNumber: string (unique, e.g. GR-2026-0001)                    |
|  - purchaseOrderId: string (FK to PurchaseOrder)                   |
|  - supplierId: string (FK to Supplier)                             |
|  - status: GoodsReceiptStatus (DRAFT, COMPLETED, CANCELLED)         |
|  - packingSlipNumber: string?                                      |
|  - receivedAt: Date                                                |
|                                                                    |
|  +-- Lines: GoodsReceiptLine[] (Entities)                          |
+--------------------------------------------------------------------+
```

---

# 5. Aggregate Roots

- **`GoodsReceipt`**: Aggregate root managing receiving lines, validating receiving constraints against Purchase Order lines, and driving stock receipt integration.

---

# 6. Entities

- **`GoodsReceiptLine`**: Receiving line entity (`id`, `goodsReceiptId`, `poLineId`, `componentId`, `quantityReceived`, `quantityRejected`, `locationId`, `batchNumber`, `expiryDate`, `serialNumbers: string[]`).

---

# 7. Value Objects

- **`GrNumber`**: Auto-generated sequential receiving document number (e.g. `GR-2026-0015`).
- **`GoodsReceiptStatus`**: Status enum (`DRAFT`, `COMPLETED`, `CANCELLED`).

---

# 8. Commands

- `CreateGoodsReceiptCommand`: Initializes a receiving session against an open PO.
- `AddGoodsReceiptLineCommand`: Adds received items with quantity, destination location, lot/batch, serials.
- `PostGoodsReceiptCommand`: Finalizes receipt, locks document, and invokes Inventory Application Services to issue RECEIPT ledger transactions.

---

# 9. Queries

- `GetGoodsReceiptByIdQuery`: Retrieves receipt details.
- `ListGoodsReceiptsQuery`: Lists receiving records by PO ID, supplier ID, or date.

---

# 10. Application Services

- **`GoodsReceiptApplicationService`**: Orchestrates receiving posting. Executes within a database transaction:
  1. Validates GR lines against PO lines.
  2. Updates PO line `quantityReceived` and PO status (`PARTIALLY_RECEIVED` or `FULFILLED`).
  3. Calls Inventory `recordReceipt()` service for each GR line to append ledger transactions, update stock projections, create batch entries, and register serial numbers.
  4. Saves GoodsReceipt aggregate as `COMPLETED`.

---

# 11. Domain Services

- **`ReceivingToleranceValidator`**: Validates whether received quantity exceeds PO line ordered quantity beyond configured policy limits.

---

# 12. State Machines

```
[DRAFT] ---> [COMPLETED] (Triggers Inventory Stock Receipt)
   |
   +-------> [CANCELLED]
```

---

# 13. Domain Invariants

- A Goods Receipt must reference an active, non-fulfilled, non-cancelled `PurchaseOrder`.
- `quantityReceived` must be strictly positive (`> 0`).
- Every line item MUST specify a valid physical `locationId` in Inventory.
- If the component requires batch tracking, `batchNumber` is required.
- If the component requires serial tracking, the number of provided `serialNumbers` MUST equal `quantityReceived`.
- A completed Goods Receipt is immutable and cannot be updated or deleted.

---

# 14. Integration Points

- **`@ananya/inventory`**: Calls `InventoryTransactionApplicationService.recordReceipt()` to create stock transactions.
- **`@ananya/procurement` (Purchase Orders)**: Updates `PurchaseOrderLine.quantityReceived`.

---

# 15. Repository Contracts

```typescript
export interface GoodsReceiptRepository {
  findById(id: string): Promise<GoodsReceipt | null>;
  findByGrNumber(grNumber: string): Promise<GoodsReceipt | null>;
  findMany(options?: FindManyGoodsReceiptsOptions): Promise<GoodsReceipt[]>;
  save(gr: GoodsReceipt): Promise<void>;
}
```

---

# 16. Database Schema

```sql
CREATE TABLE goods_receipts (
  id VARCHAR(36) PRIMARY KEY,
  gr_number VARCHAR(64) NOT NULL UNIQUE,
  purchase_order_id VARCHAR(36) NOT NULL REFERENCES purchase_orders(id),
  supplier_id VARCHAR(36) NOT NULL REFERENCES suppliers(id),
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  packing_slip_number VARCHAR(128),
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE goods_receipt_lines (
  id VARCHAR(36) PRIMARY KEY,
  goods_receipt_id VARCHAR(36) NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
  po_line_id VARCHAR(36) NOT NULL REFERENCES purchase_order_lines(id),
  component_id VARCHAR(36) NOT NULL,
  quantity_received INT NOT NULL DEFAULT 0,
  quantity_rejected INT NOT NULL DEFAULT 0,
  location_id VARCHAR(36) NOT NULL,
  batch_number VARCHAR(128),
  expiry_date TIMESTAMPTZ,
  serial_numbers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 17. API Specification

- `POST /api/v1/goods-receipts`: Create draft receipt.
- `GET /api/v1/goods-receipts`: List goods receipts.
- `GET /api/v1/goods-receipts/:id`: Get receipt details.
- `POST /api/v1/goods-receipts/:id/lines`: Add line item.
- `POST /api/v1/goods-receipts/:id/post`: Post receipt & execute stock receipt integration.

---

# 18. UI Workflows

1. **PO Receiving Entry Point**: Click "Receive Stock" on a PO page -> pre-fills Goods Receipt lines with remaining un-received quantities.
2. **Receiving Inspection Form**: Select destination storage location (shows human readable path), enter batch number, enter/scan serial numbers.
3. **Receipt Confirmation**: Shows receipt summary and stock projection updates upon posting.

---

# 19. Sequence Diagrams

```
User -> UI: Post Goods Receipt
UI -> API: POST /api/v1/goods-receipts/:id/post
API -> GrAppService: postGoodsReceipt(id)
GrAppService -> Postgres: BEGIN TRANSACTION
GrAppService -> GrRepo: findById(id)
GrAppService -> InventoryAppService: recordReceipt(componentId, locationId, qty, reference="GR-2026-0001", batch, serials)
InventoryAppService -> InventoryLedgerRepo: appendTransaction(RECEIPT)
InventoryAppService -> ProjectionRepo: updateBalance(+qty)
GrAppService -> PoRepo: updateLineQuantities(poId)
GrAppService -> GrRepo: save(gr.markCompleted())
GrAppService -> Postgres: COMMIT TRANSACTION
API -> UI: 200 OK
```

---

# 20. Future Extensions

- Quality Inspection (QA quarantine location hold prior to release into available inventory).
- Mobile barcode/QR scanner receiving mode.
