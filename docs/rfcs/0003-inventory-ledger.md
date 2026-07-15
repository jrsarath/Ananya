# RFC-0003: Inventory Ledger

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-15

---

# Summary

This RFC defines the Inventory Ledger, the authoritative record of every inventory movement within Ananya.

The Inventory Ledger is the single source of truth for inventory. Every change to inventory is represented as an immutable transaction. Current inventory is always derived from the ledger.

This RFC establishes the behavioural model of inventory and forms the foundation for all future inventory features.

---

# Motivation

An inventory system must answer questions such as:

- Where did this inventory come from?
- Where did it go?
- When did it move?
- Why did it move?
- Who performed the action?
- What is the inventory level right now?

Storing only the current quantity cannot answer these questions reliably.

The Inventory Ledger preserves the complete history of inventory movement while allowing current inventory to be calculated deterministically.

---

# Principles

## The Ledger is the Source of Truth

The Inventory Ledger is the authoritative record of inventory.

No other representation of inventory may contradict the ledger.

---

## Inventory is Derived

Current inventory is derived from the complete transaction history.

Inventory is never treated as the primary source of truth.

---

## Transactions are Immutable

Once recorded, an Inventory Transaction cannot be modified.

Corrections are represented by additional transactions.

The ledger represents history, not editable state.

---

## Every Movement is Recorded

Every change in inventory must result in a ledger transaction.

There are no exceptions.

Inventory cannot change outside the ledger.

---

# Inventory Transaction

An Inventory Transaction represents a single business event affecting inventory.

Every transaction records:

- Component
- Quantity
- Unit of Measure
- Source Location
- Destination Location
- Transaction Type
- Timestamp
- Reference
- Reason
- Actor

Future RFCs may extend the transaction model without changing these core concepts.

---

# Transaction Types

The ledger records inventory movement.

Examples include:

- Receipt
- Issue
- Transfer
- Adjustment
- Return
- Consumption
- Production

Additional transaction types may be introduced by future RFCs.

---

# Quantity

A transaction records a quantity being moved.

Quantities:

- must be greater than zero,
- use the Component's Unit of Measure,
- never represent negative values.

The direction of movement is determined by the transaction, not by the sign of the quantity.

---

# Locations

Every transaction records inventory movement between locations.

A transaction always has:

- a source location,
- a destination location.

Some locations may represent logical concepts such as:

- Supplier
- Customer
- Production
- In Transit

Future RFCs define the behaviour of these locations.

---

# Corrections

Transactions are never edited.

If a mistake occurs:

- create another transaction,
- reference the original transaction,
- preserve the complete audit history.

History must remain intact.

---

# Inventory Projection

Inventory Projections calculate the current inventory position from ledger transactions.

Projections exist solely to improve query performance.

They may be rebuilt at any time.

The ledger remains the source of truth.

---

# Invariants

The Inventory Ledger must always satisfy the following rules.

- Transactions are immutable.
- Every inventory movement is recorded.
- Inventory is derived from transactions.
- Inventory cannot change without a transaction.
- History is never rewritten.
- Every transaction belongs to exactly one business event.

---

# Design Principles

## Event-Based Model

Inventory is modelled as a sequence of business events rather than mutable state.

---

## Auditability

Every inventory movement is permanently recorded.

Complete history must always be available.

---

## Deterministic State

Given the same ledger, inventory projections must always produce the same result.

---

## Separation of Responsibilities

The ledger records history.

Inventory Projections calculate current state.

Business workflows create transactions.

Each responsibility remains independent.

---

# Alternatives Considered

## Mutable Inventory

Maintaining only the current inventory quantity was rejected because:

- history is lost,
- auditing becomes unreliable,
- accidental inconsistencies become difficult to detect.

---

## Editable Transactions

Allowing transactions to be edited was rejected because it destroys historical integrity and makes inventory calculations unreliable.

---

# Trade-offs

## Advantages

- Complete audit trail
- Deterministic inventory calculation
- Simple reconciliation
- Strong traceability
- Reliable historical reporting
- Clear separation between history and current state

---

## Disadvantages

- Requires projection logic for efficient reads.
- Ledger size grows over time.
- Historical corrections require compensating transactions rather than edits.

---

# Consequences

Future inventory features will create ledger transactions instead of modifying inventory directly.

Examples include:

- Purchase Receipts
- Transfers
- Manufacturing
- Stock Adjustments
- Returns
- Inventory Reservations

All inventory workflows extend the ledger rather than replacing it.

---

# Future Extensions

Future RFCs may define:

- Transaction Types
- Inventory Projection
- Batch Tracking
- Serial Number Tracking
- Inventory Reservations
- Manufacturing
- Cost Layers
- Inventory Valuation

These RFCs build upon the ledger without changing its fundamental principles.

---

# Non-Goals

This RFC does not define:

- Database schema
- Repository implementations
- API design
- DTOs
- Controllers
- Services
- Projection implementation
- Costing methodology
- User interface

Those concerns are addressed by future RFCs and implementation work.