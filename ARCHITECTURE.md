# Ananya Architecture

## Overview

Ananya is the operations system for 48 Studios.

The system is developed as a modular monorepo.

## Technology Stack

- pnpm
- Turborepo
- TypeScript
- Next.js
- NestJS
- PostgreSQL
- Drizzle ORM
- Zod

## Repository Structure

apps/
api/ NestJS API
web/ Next.js web application

packages/
database/ Database schema and persistence infrastructure
inventory/ Inventory domain logic
shared/ Shared contracts and utilities

## Architectural Direction

Ananya is a modular monolith.

Do not introduce microservices unless an operational requirement
demonstrates a clear need.

Modules should maintain explicit domain boundaries.

## Dependency Direction

Web
↓
API

API
↓
Domain Modules

Domain Modules
↓
Database abstractions

Database
↓
PostgreSQL

The web application must not access PostgreSQL directly.

UI components must not contain inventory domain rules.

## Inventory Core

The inventory ledger is the source of truth.

Inventory quantity must never be directly mutated.

Stock changes occur through inventory transactions.

Supported transaction concepts:

- OPENING
- RECEIVE
- MOVE
- CONSUME
- ADJUST
- RETURN
- SCRAP
- REVERSAL

Inventory balances are projections of the inventory ledger.

## Inventory Invariants

- Transactions are immutable.
- Corrections use reversal transactions.
- MOVE cannot create or destroy stock.
- RECEIVE has no source location.
- CONSUME has no destination location.
- Source and destination cannot be identical.
- Stock cannot become negative unless explicitly supported by a future policy.
- Every stock mutation must execute atomically.
- Inventory balances must be reproducible from the ledger.

## Database Strategy

PostgreSQL is the primary database.

Relational structures are used for operational entities and ledgers.

JSONB may be used for category-specific item specifications.

Database constraints should enforce domain invariants where practical.

## API Strategy

The NestJS API is the authoritative application interface.

Future clients may include:

- Web
- Mobile
- CLI
- Aura
- Barcode scanners
- Internal automation

Clients must not implement inventory mutation rules independently.
