# Agent Instructions

## Project

You are working on **Ananya**, the internal operations system for **48 Studios**.

Before making architectural, domain, or UI changes, read:

1. `ARCHITECTURE.md`
2. `DESIGN.md`
3. `AGENTS.md`

---

# Core Principles

Your first responsibility is to understand the existing repository.

Inspect before implementing.

Mirror existing patterns before introducing new ones.

Prefer the smallest coherent change.

Do not redesign architecture without explaining why.

Do not introduce new frameworks, ORMs, state managers, or infrastructure dependencies without explicit approval.

Do not build functionality for hypothetical future requirements.

---

# Repository Analysis

Before implementing a feature:

1. Inspect the repository.
2. Find the closest existing implementation.
3. Explain why it is the closest match.
4. Mirror that implementation whenever reasonable.
5. If you deviate from an existing pattern, explain why.

When analysing the repository, distinguish between:

## VERIFIED

Facts confirmed from repository files.

## ASSUMPTIONS

Reasonable conclusions that are not yet verified.

## UNKNOWN

Information that cannot be determined from the repository.

Never present assumptions as facts.

Mirror structural patterns.

Do not automatically copy business rules.

Business rules must be justified by repository evidence or explicit requirements.

---

# Domain Rules

Inventory domain rules belong in `@ananya/inventory`.

Do not implement inventory mutation logic in:

- React components
- Next.js routes
- NestJS controllers
- Database helpers

Controllers orchestrate requests.

Domain services enforce business rules.

Database code persists state.

Respect existing dependency direction.

Do not bypass established architectural boundaries.

---

# Database Rules

Do not directly update inventory balances as a business operation.

Stock mutations must originate from inventory transactions.

All stock mutations must execute inside a database transaction.

Do not delete inventory ledger transactions.

Do not silently repair inconsistent inventory data.

Mirror existing schema conventions before introducing new tables or relationships.

---

# API Rules

Controllers remain thin.

Validate external input.

Use explicit request and response contracts.

Do not expose database row structures as API contracts.

Mirror existing module structure before introducing new endpoints or services.

---

# UI Rules

Follow `DESIGN.md`.

Do not create generic ERP-style dashboards.

Avoid unnecessary cards.

Avoid gradients and glassmorphism.

Do not use oversized marketing typography.

Inventory search is a primary interaction.

Always prioritize human-readable storage paths.

Mirror existing UI patterns before introducing new ones.

---

# Change Discipline

Before making a substantial change:

1. Identify the affected module.
2. State the relevant architectural constraint.
3. Present an implementation plan.
4. Wait for approval unless explicitly instructed to continue.
5. Implement the smallest coherent change.
6. Run type checking and linting.
7. Report:
   - Files changed
   - Important architectural decisions
   - Assumptions made

Do not perform unrelated refactors.

---

# Implementation Style

Prefer consistency over cleverness.

Reuse:

- existing naming conventions
- existing validation
- existing error handling
- existing utilities
- existing folder structure

Avoid introducing new abstractions unless the existing architecture is insufficient.

Keep edits focused and minimal.
