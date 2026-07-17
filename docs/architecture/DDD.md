# Ananya Domain-Driven Design Standard

> This document defines the architectural rules for all bounded contexts inside Ananya.
>
> These are not suggestions.
> They are project conventions.
>
> If new code conflicts with this document, the code should change—not the architecture.

---

# Philosophy

Ananya is built using **Domain-Driven Design (DDD)**.

The domain model is the center of the system.

The database exists to persist the domain.

The API exists to expose the domain.

The UI exists to interact with the domain.

Nothing else drives the architecture.

---

# Layer Responsibilities

Application

- orchestrates use cases
- coordinates repositories
- calls domain behavior
- contains no business rules
- contains no persistence logic

Domain

- owns business rules
- owns invariants
- owns aggregate lifecycle
- owns identity
- owns timestamps
- contains ubiquitous language

Infrastructure

- persistence
- Drizzle
- mapping
- external services
- messaging
- file systems

Infrastructure exists to support the domain.

The domain must never depend on infrastructure.

---

# Aggregate Rules

Every aggregate is responsible for itself.

An aggregate is always valid.

An aggregate should never exist in an invalid state.

Aggregates own:

- identity
- timestamps
- invariants
- normalization
- business behavior

---

# Aggregate Lifecycle

Every aggregate exposes exactly two construction paths.

## create()

Used when creating a NEW aggregate.

Responsibilities:

- validation
- normalization
- identity generation
- timestamps
- defaults

Example

```ts
Manufacturer.create(...)
```

---

## rehydrate()

Used only by repositories.

Responsibilities:

- rebuild an existing aggregate
- preserve persisted state exactly
- no validation
- no normalization
- no generated values

Example

```ts
Manufacturer.rehydrate(...)
```

Application code must never call `rehydrate()`.

Repositories must never call `create()`.

---

# Repository Rules

Repositories persist aggregates.

Repositories never persist DTOs.

Correct

```ts
repository.save(component)
```

Incorrect

```ts
repository.save(CreateComponentInput)
```

Repository interface

```ts
findById(...)
findByUnique(...)
findMany(options?)
save(aggregate)
```

Repositories do not:

- validate business rules
- normalize business data
- create IDs
- create timestamps

Repositories decide HOW persistence occurs.

Examples:

- INSERT
- UPDATE
- UPSERT

Those are infrastructure details.

---

# Application Services

Application services orchestrate.

Typical flow

```
Receive Command

↓

Repository lookups

↓

Aggregate.create(...)

↓

Repository.save(...)

↓

Return aggregate
```

Application services never:

- generate IDs
- generate timestamps
- construct persistence models
- implement business rules

---

# Domain Objects

Domain objects are rich models.

Prefer behavior over data.

Instead of

```ts
component.name = value
```

Prefer

```ts
component.rename(...)
```

Mutations should represent business operations.

---

# Mapping

Infrastructure owns mapping.

```
Aggregate

↓

Persistence Row

↓

Database
```

and

```
Database Row

↓

Aggregate.rehydrate(...)
```

Do not leak database models into the domain.

Do not leak domain models into Drizzle schemas.

---

# Error Handling

Business failures

↓

DomainError

Examples

- DuplicateManufacturerCode
- InvalidComponentSku
- InvalidLocationCode

Infrastructure failures

↓

Infrastructure errors

Examples

- Database unavailable
- Insert failed
- Network timeout

Do not use DomainError for infrastructure failures.

---

# Identity

Identity belongs to the domain.

Current implementation

```ts
ObjectId.generate()
```

Repositories never create identities.

Application services never create identities.

---

# Time

The aggregate owns:

- createdAt
- updatedAt

Repositories preserve them.

Repositories never generate them.

---

# Query Contracts

Every repository exposes

```ts
findMany(options?)
```

even if options are empty today.

This preserves API stability.

Future filtering extends the options object.

Not the method signature.

---

# Immutability

Aggregates should expose readonly state.

Business changes occur through explicit methods.

Never expose mutable public fields.

---

# Naming

The domain speaks the language of the business.

Avoid technical names.

Good

- Component
- Manufacturer
- InventoryTransaction

Avoid

- ComponentDTO
- ComponentEntity
- ComponentModel

Those are implementation concepts.

---

# Database

The database is not the source of truth.

The domain is.

Database schema changes should follow domain changes.

Not the other way around.

---

# Feature Development

Every new feature should answer:

Where does this business rule belong?

If the answer is

"the application service"

it is probably wrong.

Business rules almost always belong inside the aggregate.

---

# Architecture Debt

Ananya does not intentionally accumulate architectural debt.

Feature debt may exist.

Performance debt may exist.

Architecture debt should be corrected immediately.

---

# Code Reviews

Every review should ask:

- Does this express the domain?
- Are responsibilities in the correct layer?
- Is the aggregate protecting its invariants?
- Is persistence leaking into the domain?
- Is application orchestration becoming business logic?

If the answer is yes, fix the architecture before merging.

---

# Long-Term Goal

The architecture should remain stable while features evolve.

Adding

- Purchasing
- Manufacturing
- BOM
- Warehouse
- Reservations
- Serial Numbers
- Lots
- Accounting

should require **new domain models**, not architectural rewrites.

The architecture is the foundation.

Features are built on top of it.
