# Agent Instructions

## Project

You are working on Ananya, the internal operations system for 48 Studios.

Read these files before making architectural or UI changes:

1. ARCHITECTURE.md
2. DESIGN.md
3. This file

## General Rules

Do not redesign the architecture without explaining the reason.

Do not introduce new frameworks, ORMs, state managers, or infrastructure
dependencies without explicit approval.

Prefer simple implementations.

Do not prematurely generalize.

Do not build functionality for hypothetical future requirements.

## Domain Rules

Inventory domain rules belong in @ananya/inventory.

Do not implement inventory mutation logic in:

- React components
- Next.js routes
- NestJS controllers
- Database helpers

Controllers orchestrate requests.

Domain services enforce business rules.

Database code persists state.

## Database Rules

Do not directly update inventory balances as a business operation.

Stock mutations must originate from inventory transactions.

All stock mutations must execute inside a database transaction.

Do not delete inventory ledger transactions.

Do not silently repair inconsistent inventory data.

## API Rules

Controllers should remain thin.

Validate external input.

Do not expose database row structures as accidental API contracts.

Use explicit request and response contracts.

## UI Rules

Follow DESIGN.md.

Do not create generic ERP-style dashboards.

Avoid unnecessary cards.

Avoid gradients and glassmorphism.

Do not use oversized marketing typography.

Inventory search is a primary interaction.

Always prioritize human-readable storage paths.

## Change Discipline

Before making a substantial change:

1. Identify the affected module.
2. State the relevant architectural constraint.
3. Implement the smallest coherent change.
4. Run type checking and linting.
5. Report files changed and important decisions.

Do not perform unrelated refactors.