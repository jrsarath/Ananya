# RFC-0008: Inventory Reservations

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-15

---

# Summary

This RFC defines Inventory Reservations.

A Reservation temporarily allocates inventory for a future business operation without removing it from inventory.

Reservations ensure that inventory cannot be promised to multiple consumers simultaneously while preserving the Inventory Ledger as the single source of truth.

---

# Motivation

Inventory often needs to be allocated before it is physically consumed.

Examples include:

- Manufacturing Orders
- Customer Orders
- Internal Requests
- Repair Jobs
- Planned Transfers

Without reservations, available inventory can be overcommitted, resulting in failed operations and inconsistent planning.

---

# Principles

## Reservation Does Not Move Inventory

Creating a Reservation does not create an Inventory Transaction.

Inventory remains physically unchanged.

Only allocation changes.

---

## Reservation Is Temporary

Reservations exist only until they are:

- Fulfilled
- Released
- Expired
- Cancelled

Reservations are never permanent inventory records.

---

## Inventory Ownership Does Not Change

Reserved inventory remains in the same Location.

The Reservation only limits availability for other business processes.

---

## Ledger Remains the Source of Truth

Reservations never replace Inventory Transactions.

When inventory is physically moved or consumed, an Inventory Transaction is created according to the Inventory Ledger model.

---

# Reservation Model

A Reservation associates:

- Component
- Quantity
- Unit of Measure
- Location
- Business Reference
- Reserved By
- Created At
- Expiry (optional)

Future RFCs may extend reservation metadata.

---

# Inventory States

Inventory may exist in multiple derived states.

## On Hand

The total inventory currently available at a Location.

---

## Reserved

Inventory allocated for future use.

Reserved inventory remains physically present.

---

## Available

Inventory that is free for allocation.

Available Inventory is derived as:

```
Available = On Hand − Reserved
```

---

# Reservation Lifecycle

A Reservation may transition through the following states.

```
Created

↓

Active

↓

Fulfilled
```

or

```
Created

↓

Cancelled
```

or

```
Created

↓

Expired
```

Only Active Reservations affect Available Inventory.

---

# Fulfilment

When inventory is physically consumed or moved:

1. The Reservation is fulfilled.
2. The corresponding Inventory Transaction is created.
3. Reserved quantity decreases.
4. On Hand inventory changes through the Inventory Ledger.

---

# Expiry

Reservations may define an expiry.

Expired Reservations:

- no longer reserve inventory,
- do not modify Inventory Transactions,
- may be recreated if required.

---

# Design Principles

## Allocation, Not Ownership

Reservations allocate inventory.

They do not transfer ownership.

---

## Derived Availability

Available Inventory is derived.

It is never stored independently.

---

## Independent Business Processes

Reservations may originate from:

- Manufacturing
- Sales
- Repairs
- Internal Requests
- Future modules

The reservation model remains independent of those workflows.

---

## No Inventory Mutation

Reservations never modify inventory quantities.

Only Inventory Transactions modify inventory.

---

# Alternatives Considered

## Directly Reducing Inventory

Reducing inventory when work is planned was rejected because inventory has not yet physically moved.

---

## Ignoring Reservations

Using only current inventory was rejected because concurrent business operations may overcommit inventory.

---

# Trade-offs

## Advantages

- Prevents over-allocation
- Improves planning
- Supports manufacturing
- Supports customer commitments
- Maintains Ledger integrity

---

## Disadvantages

- Introduces additional derived calculations.
- Requires lifecycle management.
- Requires reconciliation of expired Reservations.

---

# Consequences

Future business modules should reserve inventory before initiating long-running operations.

Inventory movement continues to be recorded exclusively through the Inventory Ledger.

Reservations complement the ledger but never replace it.

---

# Future Extensions

Future RFCs may define:

- Partial Reservations
- Reservation Priorities
- Automatic Expiry
- Reservation Policies
- Reservation Approval Workflows

---

# Non-Goals

This RFC does not define:

- Manufacturing Orders
- Sales Orders
- Purchase Orders
- Scheduling
- Database schema
- APIs
- User interfaces

These concerns are addressed by future RFCs and implementation work.
