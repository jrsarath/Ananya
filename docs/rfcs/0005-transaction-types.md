# RFC-0005: Inventory Transaction Types

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-15

---

# Summary

This RFC defines the canonical transaction types used by the Inventory Ledger.

Transaction Types describe the business meaning of an Inventory Transaction. They provide a consistent vocabulary for inventory movement while remaining independent of the business workflow that created the transaction.

---

# Motivation

Different workflows create inventory movement:

- Purchasing
- Manufacturing
- Transfers
- Adjustments
- Returns

Although these workflows differ, they all ultimately create inventory transactions.

Without standardized transaction types, different modules would describe the same inventory movement differently, leading to inconsistent reporting and business logic.

---

# Principles

## Business Meaning

Transaction Types describe **why** inventory moved.

They do not describe how the transaction was implemented.

---

## Independent of Workflow

Multiple workflows may create the same Transaction Type.

For example:

- Purchase Receipt
- Supplier Return Reversal

may both generate a **Receipt** transaction.

---

## Immutable

The Transaction Type is part of an immutable Inventory Transaction.

It cannot be modified after creation.

---

# Canonical Transaction Types

## Receipt

Inventory entering the organization.

Examples:

- Purchase Receipt
- Donation
- Initial Stock
- Supplier Replacement

---

## Issue

Inventory leaving the organization.

Examples:

- Sale
- Scrap
- Disposal
- Write-off

---

## Transfer

Inventory moved between two Locations.

Total inventory remains unchanged.

---

## Adjustment

Administrative correction of inventory.

Used only when inventory must be corrected outside normal business workflows.

Adjustments should be exceptional.

---

## Return

Inventory returning from a previous Issue.

Examples:

- Customer Return
- Production Return
- Internal Return

---

## Consumption

Inventory consumed during a business process.

Examples:

- Manufacturing
- Repair
- Testing
- Internal Use

Consumption permanently reduces available inventory.

---

## Production

Inventory created by consuming other inventory.

Examples:

- PCB Assembly
- Kit Creation
- Finished Goods

Production increases inventory for the produced Component.

---

# Transaction Classification

Transaction Types fall into three categories.

## Inbound

Inventory enters the organization.

- Receipt
- Return

---

## Outbound

Inventory leaves inventory ownership.

- Issue
- Consumption

---

## Internal

Inventory ownership remains within the organization.

- Transfer
- Adjustment
- Production

---

# Design Principles

## Small Vocabulary

The number of Transaction Types should remain intentionally small.

Business workflows should extend Transaction Types rather than introduce new ones unnecessarily.

---

## Workflow Independence

Transaction Types describe inventory movement.

Business documents describe business processes.

These responsibilities remain separate.

---

## Stable Semantics

The meaning of each Transaction Type should remain stable over time.

Future features should reuse existing Transaction Types whenever possible.

---

# Alternatives Considered

## Workflow-Specific Transaction Types

Creating unique Transaction Types such as:

- PurchaseReceipt
- SalesShipment
- ManufacturingConsumption

was rejected because it tightly couples inventory behaviour to business workflows.

---

## Generic Event Type

Using a single generic transaction without business classification was rejected because it complicates reporting and reduces readability.

---

# Trade-offs

## Advantages

- Consistent reporting
- Stable business vocabulary
- Simple analytics
- Easier future expansion
- Reduced duplication

---

## Disadvantages

- Some workflows require additional metadata beyond the Transaction Type.
- New business processes must map onto existing Transaction Types.

---

# Consequences

Future modules should create one of the canonical Transaction Types defined in this RFC.

Business workflows should not introduce new Transaction Types unless a new inventory behaviour is introduced.

---

# Future Extensions

Future RFCs may define:

- Transaction Reasons
- Business Documents
- Approval Workflows
- Inventory Reservations

These extend Transaction Types without changing their meaning.

---

# Non-Goals

This RFC does not define:

- Business documents
- Purchase Orders
- Sales Orders
- Manufacturing Orders
- Database schema
- APIs
- User interfaces

These are addressed by future RFCs.