# RFC-0012: Supplier Returns

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-22

---

# 1. Purpose

This RFC defines the **Supplier Return** aggregate and return workflow in the Procurement Bounded Context. Supplier Returns handle Return Merchandise Authorizations (RMAs), returning defective or incorrect components back to vendors, and deducting stock balances via `@ananya/inventory` stock issue transactions.

---

# 2. Scope

- Return request lifecycle (`DRAFT`, `APPROVED`, `DISPATCHED`, `COMPLETED`, `CANCELLED`).
- Return reason codes (Defective, Wrong Item, Over-shipment, Shipping Damage, Specification Non-compliance).
- Inventory integration for stock removal upon physical dispatch.
- Credit memo / replacement tracking reference.

---

# 3. Ubiquitous Language

- **Supplier Return (SR)**: Document tracking component returns to a supplier.
- **RMA Number**: Return Merchandise Authorization number assigned by the supplier.
- **Return Reason**: Categorization of return root cause.
- **Stock Issue Transaction**: Inventory transaction generated in `@ananya/inventory` deducting returned stock from inventory projections.

---

# 4. Domain Model

```
+--------------------------------------------------------------------+
|                     Supplier Return Aggregate                      |
|                                                                    |
| [Supplier Return ID] (PK)                                          |
|  - returnNumber: string (unique, e.g. SR-2026-0001)                |
|  - supplierId: string (FK to Supplier)                             |
|  - purchaseOrderId: string?                                        |
|  - rmaNumber: string?                                              |
|  - status: SupplierReturnStatus                                    |
|  - totalAmount: Money                                              |
|  - dispatchedAt: Date?                                             |
|                                                                    |
|  +-- Lines: SupplierReturnLine[] (Entities)                        |
+--------------------------------------------------------------------+
```

---

# 5. Aggregate Roots

- **`SupplierReturn`**: Root aggregate controlling return validation, stock removal coordination, and return status state machine.

---

# 6. Entities

- **`SupplierReturnLine`**: Return line entity (`id`, `supplierReturnId`, `componentId`, `quantityReturned`, `locationId`, `unitPrice`, `reason`, `batchNumber`, `serialNumbers: string[]`).

---

# 7. Value Objects

- **`ReturnNumber`**: Sequential document identifier (e.g. `SR-2026-0005`).
- **`SupplierReturnStatus`**: Status enum (`DRAFT`, `APPROVED`, `DISPATCHED`, `COMPLETED`, `CANCELLED`).

---

# 8. Commands

- `CreateSupplierReturnCommand`: Creates draft return document.
- `AddReturnLineCommand`: Specifies component, source location, quantity, reason, lot/serial.
- `ApproveSupplierReturnCommand`: Approves return with supplier RMA reference.
- `DispatchSupplierReturnCommand`: Executes physical dispatch and triggers stock deduction in Inventory.

---

# 9. Queries

- `GetSupplierReturnByIdQuery`: Retrieves return document details.
- `ListSupplierReturnsQuery`: Filters returns by supplier, status, or date range.

---

# 10. Application Services

- **`SupplierReturnApplicationService`**: Coordinates return approval and physical dispatch. When dispatched, it invokes Inventory `recordIssue()` for each line item to deduct stock from the specified location and ledger.

---

# 11. Domain Services

- **`ReturnStockAvailabilityValidator`**: Verifies that sufficient stock exists in the specified location prior to authorizing return dispatch.

---

# 12. State Machines

```
[DRAFT] ---> [APPROVED] ---> [DISPATCHED] ---> [COMPLETED]
   |             |
   +------------>+-----------> [CANCELLED]
```

---

# 13. Domain Invariants

- A return line must specify a valid physical `locationId` where stock currently resides.
- `quantityReturned` must not exceed available stock in that location.
- Upon dispatch, the return is locked and stock issue transactions are generated in `@ananya/inventory`.

---

# 14. Integration Points

- **`@ananya/inventory`**: Calls `InventoryTransactionApplicationService.recordIssue()` with transaction type `ISSUE` and reference `SR-2026-XXXX`.

---

# 15. Repository Contracts

```typescript
export interface SupplierReturnRepository {
  findById(id: string): Promise<SupplierReturn | null>;
  findByReturnNumber(returnNumber: string): Promise<SupplierReturn | null>;
  findMany(options?: FindManySupplierReturnsOptions): Promise<SupplierReturn[]>;
  save(returnDoc: SupplierReturn): Promise<void>;
}
```

---

# 16. Database Schema

```sql
CREATE TABLE supplier_returns (
  id VARCHAR(36) PRIMARY KEY,
  return_number VARCHAR(64) NOT NULL UNIQUE,
  supplier_id VARCHAR(36) NOT NULL REFERENCES suppliers(id),
  purchase_order_id VARCHAR(36) REFERENCES purchase_orders(id),
  rma_number VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  total_amount NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
  dispatched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE supplier_return_lines (
  id VARCHAR(36) PRIMARY KEY,
  supplier_return_id VARCHAR(36) NOT NULL REFERENCES supplier_returns(id) ON DELETE CASCADE,
  component_id VARCHAR(36) NOT NULL,
  location_id VARCHAR(36) NOT NULL,
  quantity_returned INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
  reason TEXT NOT NULL,
  batch_number VARCHAR(128),
  serial_numbers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 17. API Specification

- `POST /api/v1/supplier-returns`: Create draft return.
- `GET /api/v1/supplier-returns`: List returns.
- `GET /api/v1/supplier-returns/:id`: Get return details.
- `POST /api/v1/supplier-returns/:id/lines`: Add line item.
- `POST /api/v1/supplier-returns/:id/approve`: Approve return.
- `POST /api/v1/supplier-returns/:id/dispatch`: Dispatch return & deduct stock.

---

# 18. UI Workflows

1. **Create Supplier Return**: Select supplier & PO, select defective component lines from previous receipt, enter return reason and RMA number.
2. **Dispatch Return**: Review location stock balances, confirm physical shipment, trigger inventory stock reduction.

---

# 19. Sequence Diagrams

```
User -> UI: Dispatch Return
UI -> API: POST /api/v1/supplier-returns/:id/dispatch
API -> ReturnAppService: dispatchReturn(id)
ReturnAppService -> InventoryAppService: recordIssue(componentId, locationId, qty, reference="SR-2026-0001")
InventoryAppService -> InventoryLedgerRepo: appendTransaction(ISSUE)
ReturnAppService -> ReturnRepo: save(returnDoc.markDispatched())
API -> UI: 200 OK
```

---

# 20. Future Extensions

- Credit memo reconciliation integration with Accounting module.
