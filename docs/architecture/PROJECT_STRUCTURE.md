# Project Structure

This document describes how the Ananya repository is organized and where new code should be added.

## Repository Layout

```
apps/
packages/
docs/
.agents/
.github/
```

---

## apps/

Applications that can be executed.

```
apps/
├── api
└── web
```

### api

NestJS application responsible for exposing the HTTP API.

Responsibilities:

- Controllers
- Services
- Dependency Injection
- Repository implementations
- HTTP concerns

### web

Next.js application providing the user interface.

Responsibilities:

- Pages
- UI Components
- Client-side interactions

---

## packages/

Shared libraries used by one or more applications.

```
packages/
├── core
├── database
├── inventory
├── shared
├── eslint-config
└── typescript-config
```

### core

Framework-independent primitives shared across the project.

Examples:

- Base errors
- Shared value objects
- Common utilities

### inventory

Contains inventory domain logic.

Examples:

- Entities
- Use cases
- Repository interfaces
- Domain errors

No framework-specific code belongs here.

### database

Persistence layer.

Contains:

- Drizzle schemas
- Migrations
- Database client
- Repository implementations used by applications

### shared

Utilities shared across multiple packages.

Business logic should not be placed here.

### eslint-config

Shared ESLint configuration.

### typescript-config

Shared TypeScript configuration.

---

## docs/

Project documentation.

Includes:

- Architecture
- Development guides
- Standards
- RFCs

---

## .agents/

AI engineering resources.

Contains:

- Skills
- Prompt libraries
- References
- Playbooks

Used to improve consistency when AI assists development.

---

## Dependency Direction

```
apps
    ↓
packages
    ↓
core
```

Applications may depend on packages.

Packages should not depend on applications.

Framework-independent packages should remain reusable.

---

## Adding New Features

When introducing a new business capability:

1. Add domain logic to the appropriate package.
2. Add persistence if required.
3. Expose functionality through the API.
4. Implement UI separately.

Business logic should never originate in the UI or API layers.