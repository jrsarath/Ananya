Ananya is the internal operations system for 48 Studios.

Before substantial changes, follow ARCHITECTURE.md, DESIGN.md, and AGENTS.md.

Architecture:

- pnpm Turborepo monorepo
- Next.js web application in apps/web
- NestJS API in apps/api
- PostgreSQL with Drizzle
- Inventory domain logic belongs in packages/inventory
- Database infrastructure belongs in packages/database
- Shared contracts/utilities belong in packages/shared

Ananya is a modular monolith.

Do not introduce microservices or new major frameworks without approval.

The inventory ledger is the source of truth.

Never directly mutate stock quantity as a business operation.
Stock changes must occur through inventory transactions.

Inventory transactions are immutable.
Corrections use reversal transactions.

Keep NestJS controllers thin.
Do not put domain logic in controllers.

Do not put domain logic in React components.

For UI work, follow DESIGN.md.

The UI should be dense, calm, operational, and search-first.
Avoid generic ERP dashboards, excessive cards, gradients,
glassmorphism, and oversized marketing typography.

Prefer human-readable storage paths over canonical location codes.

Make the smallest coherent change and avoid unrelated refactors.