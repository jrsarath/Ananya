# RFC-0004: Inventory Projection

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-15

---

# Summary

This RFC defines the Inventory Projection model.

Inventory Projections provide the current inventory position by deriving state from the Inventory Ledger. They exist to support fast queries while preserving the Inventory Ledger as the single source of truth.

Inventory Projections never replace the ledger and may be rebuilt at any time.

---

# Motivation

The Inventory Ledger records every inventory movement throughout the lifetime of the system.

While the ledger provides complete history, calculating current inventory directly from every transaction becomes increasingly expensive as transaction volume grows.

Inventory Projections provide an optimized representation of the current inventory position while preserving complete historical accuracy.

---

# Principles

## The Ledger Remains the Source of Truth

Inventory Projections are derived from the Inventory Ledger.

If a projection and the ledger disagree, the ledger is always correct.

---

## Projections are Disposable

Inventory Projections are derived data.

They may be deleted and rebuilt without losing business information.

---

## Deterministic Calculation

Given the same Inventory Ledger, rebuilding a projection must always produce identical results.

Projection generation must be deterministic.

---

## No Business Logic

Inventory Projections contain no business rules.

They exist solely to answer read queries efficiently.

Business decisions are always based on the Inventory Ledger.

---

# Projection Model

A projection represents the current inventory position for a Component at a Location.

A projection includes:

- Component
- Location
- Quantity
- Unit of Measure
- Last Updated

Future RFCs may extend projections with additional derived attributes.

---

# Projection Lifecycle

Inventory Projections are updated whenever new Inventory Transactions are recorded.

A projection may also be rebuilt from the complete ledger.

Rebuilding must produce the same result as incremental updates.

---

# Rebuild Strategy

The system must support rebuilding projections from the Inventory Ledger.

Rebuilding projections:

- does not modify the ledger,
- does not change transaction history,
- replaces derived state only.

This guarantees recovery from corruption or implementation defects.

---

# Query Model

Read operations should use Inventory Projections instead of scanning the complete ledger.

Typical queries include:

- Current stock
- Inventory by location
- Inventory by component
- Components below reorder level
- Empty locations

Historical reporting continues to use the Inventory Ledger.

---

# Design Principles

## Read Model

Inventory Projection is a read model.

It is optimized for querying rather than recording business events.

---

## Separation of Responsibilities

Inventory Transactions record history.

Inventory Projections represent current state.

These responsibilities remain independent.

---

## Event Consistency

Projection updates must faithfully represent the Inventory Ledger.

The projection is a consequence of transactions, never an independent source of data.

---

# Alternatives Considered

## Reading Directly from the Ledger

Calculating inventory from the ledger for every query was rejected because query performance degrades as transaction volume increases.

---

## Storing Inventory as Mutable State

Maintaining inventory only as mutable quantities was rejected because it sacrifices historical accuracy and auditability.

---

# Trade-offs

## Advantages

- Fast inventory queries
- Simple reporting
- Deterministic rebuilds
- Clear separation between history and current state

---

## Disadvantages

- Requires synchronization with the ledger
- Introduces additional derived data
- Requires rebuild capability

---

# Consequences

Future inventory features should query Inventory Projections for current inventory.

Historical analysis, auditing, and reconciliation continue to use the Inventory Ledger.

This separation allows both efficient reads and complete historical integrity.

---

# Future Extensions

Future RFCs may extend projections with:

- Reserved Quantity
- Available Quantity
- Incoming Quantity
- Outgoing Quantity
- Batch Balances
- Serial Number Views
- Cost Views

These remain derived representations of the Inventory Ledger.

---

# Non-Goals

This RFC does not define:

- Projection implementation
- Database schema
- Caching strategy
- Event processing mechanism
- APIs
- User interfaces

These concerns are implementation details.
