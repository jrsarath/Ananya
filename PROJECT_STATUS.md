# Ananya Project Status

## Overall Progress

Display overall progress as checklists grouped by major milestones.

- [x] Monorepo
- [x] NestJS API
- [x] Next.js Web
- [x] PostgreSQL
- [x] Drizzle ORM
- [x] Shared TypeScript Config
- [x] Core Package
- [x] Inventory Package
- [x] Locations Module
- [ ] Components Module
- [ ] Manufacturers
- [ ] Suppliers
- [ ] Stock
- [ ] BOM
- [ ] Projects

---

## Current Sprint

Include:

- Sprint Goal: Implement core inventory management features and establish foundational modules
- Current Feature: Location management with CRUD operations
- Current Branch (if available): main
- Current Status: In progress

---

## Current Task

A checkbox list of active work.

- [ ] Design Component aggregate
- [ ] Implement repository interface
- [ ] Database schema
- [ ] API endpoints
- [ ] Tests
- [ ] Documentation

Only the currently active work should appear here.

Completed tasks should move into the completed section.

---

## Completed

Chronological list.

Each completed milestone should include a completion date.

### 2026-07-15

- Shared TypeScript configuration completed
- Workspace package architecture finalized
- Locations module completed
- Error handling standardized

---

## Architecture Decisions

Maintain a short summary of important decisions.

- Shared TypeScript configs under packages/typescript-config
- Repository pattern used for persistence
- Domain packages remain framework independent
- NestJS used only in API layer
- Drizzle ORM chosen for database operations
- Modular monolith architecture with explicit domain boundaries

This is NOT a replacement for ADRs.

Only summarize the important decisions.

---

## Technical Debt

Track known issues that are intentionally postponed.

- Authentication
- Authorization
- Search indexing
- Import/export
- Barcode scanning

---

## Backlog

Prioritized list.

1. Components
2. Manufacturers
3. Suppliers
4. Categories
5. Stock Ledger
6. BOM
7. Projects

---

## AI Notes

This section is intended for AI coding agents.

Include:

- Current engineering standards
- Important repository conventions
- Current architectural constraints

Keep it concise.

### Engineering Standards

- Strong TypeScript typing throughout the codebase
- DomainError hierarchy for consistent error handling
- Repository pattern for data access operations
- Separation of concerns between domain logic, data access, and presentation layers
- Explicit dependency direction from Web → API → Domain Modules → Database Abstractions → PostgreSQL

### Repository Conventions

- Modular monolith architecture with clear domain boundaries
- Packages organized under `packages/` directory
- Apps organized under `apps/` directory
- Shared contracts and utilities in `@ananya/shared`
- Core engineering concepts in `@ananya/core`

### Architectural Constraints

- Domain packages must remain framework independent
- API layer orchestrates requests, domain services enforce business rules
- Database code persists state, not business logic
- All stock mutations must execute inside a database transaction
- Inventory ledger transactions cannot be deleted