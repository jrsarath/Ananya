# RFC-0002: Inventory Domain Model

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-15

---

# Summary

This RFC establishes the core domain vocabulary used throughout Ananya.

Its purpose is to define the primary business concepts of the inventory domain and the relationships between them before implementation begins.

This RFC is intentionally implementation-independent. It defines the language of the inventory system, not how it is implemented.

---

# Motivation

As the system grows, every contributor should share the same understanding of what terms such as *Component*, *Location*, *Inventory*, and *Transaction* mean.

Without a common vocabulary, different modules begin to use the same words with different meanings, leading to inconsistent implementations and difficult maintenance.

This RFC establishes a ubiquitous language for the inventory domain that future RFCs and implementations will build upon.

---

# Domain Concepts

## Manufacturer

A **Manufacturer** represents the organization responsible for manufacturing a Component.

Manufacturers are reference data.

A Manufacturer describes *who made the item*, not where it was purchased.

---

## Supplier

A **Supplier** represents an organization from which Components are acquired.

Suppliers are reference data.

A Supplier describes *where the item was obtained*, not who manufactured it.

A Manufacturer may also be a Supplier.

---

## Category

A **Category** classifies Components into logical groups.

Categories are reference data used for organization, discovery, and reporting.

Categories do not contain business logic.

---

## Unit of Measure

A **Unit of Measure** defines how a Component is quantified.

Examples include:

- Piece
- Meter
- Kilogram
- Reel

Units of Measure are reference data.

Future RFCs may introduce conversions between compatible units.

---

## Component

A **Component** is a catalog definition.

A Component describes **what an item is**.

A Component may include information such as:

- Name
- Description
- Manufacturer
- Category
- Unit of Measure

A Component **does not represent inventory**.

It has no quantity.

It may exist even when no stock exists.

---

## Location

A **Location** represents a place that can own inventory.

Locations may be:

- Physical
  - Warehouse
  - Shelf
  - Bin
- Logical
  - Production
  - In Transit
  - Customer
  - Supplier

Locations are reference data.

Future RFCs will define the different location types and their behaviour.

---

## Inventory Transaction

An **Inventory Transaction** is an immutable business event that records the movement of inventory.

Transactions are the **source of truth** for inventory.

Examples include:

- Receipt
- Issue
- Transfer
- Adjustment
- Consumption
- Return

Once recorded, a transaction is never modified.

Corrections are represented by new transactions.

---

## Inventory Projection

An **Inventory Projection** is derived state representing the current inventory position.

It is calculated entirely from Inventory Transactions.

Inventory Projections exist for performance and reporting.

They are **never** the source of truth.

---

# Classification

The inventory domain consists of four conceptual categories.

## Reference Data

Reference Data defines concepts used throughout the system.

Examples include:

- Manufacturer
- Supplier
- Category
- Location
- Unit of Measure

Reference Data changes infrequently.

---

## Catalog Data

Catalog Data defines **what exists**.

Currently:

- Component

Catalog Data contains definitions but does not represent inventory.

---

## Transactional Data

Transactional Data records business events.

Currently:

- Inventory Transaction

Transactions are immutable.

---

## Derived Data

Derived Data is calculated from Transactional Data.

Currently:

- Inventory Projection

Derived Data may be rebuilt at any time.

---

# Relationships

The primary relationships between domain concepts are:

```
Manufacturer
        │
Supplier │
        │
Category
        │
        ▼
   Component
        │
        ▼
Inventory Transaction
        │
        ▼
Inventory Projection
```

Inventory is established through **Transactions**, not through Components.

Components become inventory only when inventory transactions occur.

---

# Design Principles

## Inventory Is Derived

Inventory is **not** a primary domain object.

Inventory is derived from the complete history of Inventory Transactions.

---

## Components Define, Transactions Record

Components define *what* exists.

Transactions record *what happened*.

These responsibilities must remain separate.

---

## Immutable History

Transactions are immutable.

Historical events are never rewritten.

Corrections are represented as additional transactions.

---

## Clear Separation of Responsibilities

Reference Data defines the business vocabulary.

Catalog Data defines inventory items.

Transactional Data records events.

Derived Data represents calculated state.

---

## Framework Independence

The inventory domain is independent of infrastructure.

Business rules belong in the domain and must not depend on frameworks, databases, or transport protocols.

---

# Alternatives Considered

## Storing Quantity on Components

An alternative design stores the current quantity directly on each Component.

This approach was rejected because it:

- loses historical context,
- makes auditing difficult,
- increases the risk of inconsistent inventory,
- tightly couples current state with historical events.

---

## Treating Inventory as a Primary Entity

Another approach models Inventory as a mutable entity.

This was rejected because inventory is the result of business events, not a standalone business concept.

---

# Trade-offs

## Advantages

- Clear domain vocabulary
- Consistent architectural boundaries
- Complete inventory history
- Deterministic inventory calculations
- Strong auditability
- Easier future expansion

---

## Disadvantages

- Derived inventory requires projection logic.
- Immutable history introduces additional implementation complexity.
- Some queries require aggregation rather than direct reads.

---

# Consequences

Future inventory features should build upon these concepts rather than redefining them.

Examples include:

- Purchasing
- Manufacturing
- Transfers
- Reservations
- Batch Tracking
- Serial Numbers
- Reporting

These features extend the established domain model without changing its vocabulary.

---

# Future Extensions

Future RFCs are expected to define:

- Inventory Ledger
- Transaction Types
- Batch Tracking
- Serial Number Tracking
- Inventory Reservations
- Multi-site Inventory
- Manufacturing
- Units of Measure Conversion

---

# Non-Goals

This RFC does not define:

- Database schema
- Repository implementations
- API design
- DTOs
- Framework-specific behaviour
- Persistence strategy
- User interface
- Reporting implementation

Those concerns are addressed by future RFCs and implementation work.