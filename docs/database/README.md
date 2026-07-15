# Database

This document describes the persistence architecture used by Ananya.

## Overview

Ananya uses:

- PostgreSQL
- Drizzle ORM

Database schema definitions are maintained in:

```
packages/database
```

---

## Responsibilities

The database package is responsible for:

- schema definitions
- migrations
- database connections
- persistence infrastructure

It does **not** contain business rules.

---

## Domain Ownership

The domain defines repository interfaces.

The database package provides repository implementations.

Dependency direction:

```
Domain

↓

Repository Interface

↓

Database Implementation

↓

PostgreSQL
```

---

## Migrations

Schema changes are managed through Drizzle migrations.

Every schema modification should include a corresponding migration.

---

## Design Principles

- Prefer relational modelling.
- Use constraints to enforce invariants where appropriate.
- Keep persistence concerns outside the domain.
- Never bypass repository interfaces.

---

## Future Evolution

As the system grows, this document will expand to describe:

- indexing strategy
- transaction management
- projections
- inventory ledger persistence
- reporting models