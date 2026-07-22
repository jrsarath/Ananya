# Architecture

This document describes the architectural principles of Ananya.

## Goals

The architecture is designed to:

- Keep business logic independent of frameworks.
- Encourage modular growth.
- Support long-term maintainability.
- Allow multiple clients to share the same domain.
- Keep infrastructure replaceable.

---

## Architectural Style

Ananya follows a modular monolith architecture.

Business capabilities are implemented as independent domain modules while remaining part of a single deployable application.

Examples include:

- Locations
- Components
- Manufacturers

Each module owns its business rules.

---

## Layered Design

```
Web / Mobile / CLI

        ↓

API Layer

        ↓

Domain Packages

        ↓

Repository Interfaces

        ↓

Infrastructure
(Database, External Services)
```

Dependencies always point downward.

Business logic never depends on infrastructure.

---

## Domain-First Design

Business rules are implemented in domain packages.

Examples include:

- validation
- invariants
- workflows
- domain errors

The domain should remain independent of:

- NestJS
- Next.js
- Drizzle
- PostgreSQL

This allows the business logic to be reused across different applications.

---

## Dependency Inversion

The domain defines contracts.

Infrastructure provides implementations.

For example:

```
LocationRepository

↓

DrizzleLocationRepository
```

This keeps persistence replaceable without changing domain logic.

---

## Repository Pattern

Repositories abstract persistence from business logic.

Domain use cases operate on repository interfaces rather than database implementations.

---

## Validation

Validation occurs in two places.

### API Layer

Responsible for validating incoming requests.

### Domain Layer

Responsible for enforcing business rules and invariants.

Both layers are required.

---

## Documentation

Architectural decisions should be recorded as RFCs.

Long-term decisions should not live in implementation documentation.

See:

- `docs/rfcs/`

---

## Evolution

The architecture is expected to evolve incrementally.

Large architectural changes should be introduced through RFCs before implementation.
