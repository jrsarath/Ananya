# Project Structure

## Overview

Ananya is a Turborepo monorepo that follows a modular architecture with clear separation of concerns. The project structure is designed to support both the API and web applications while maintaining shared domain logic.

## Directory Layout

```
.
├── apps/
│   ├── api/                 # NestJS API application
│   │   ├── src/             # Source code
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   └── infrastructure/
│   │   │       └── repositories/  # Infrastructure implementations
│   │   └── ...              # NestJS configuration files
│   └── web/                 # Next.js web application
│       ├── app/             # App directory (Next.js 13+ app router)
│       ├── public/          # Static assets
│       └── ...              # Next.js configuration files
├── packages/
│   ├── database/            # Database schema and persistence infrastructure
│   │   ├── drizzle/         # Drizzle ORM migrations and schema
│   │   └── src/             # Database utilities and query helpers
│   ├── inventory/           # Inventory domain logic
│   │   └── src/             # Domain services, repositories, entities
│   └── shared/              # Shared contracts and utilities
├── docs/                    # Documentation files
├── .github/                 # GitHub configuration and templates
├── apps/                    # Application code
├── packages/                # Shared packages
└── README.md                # Project overview
```

## Apps Directory

### API (`apps/api`)
- NestJS application with RESTful endpoints
- Implements business logic through services
- Uses dependency injection for loose coupling
- Handles request validation with Zod schemas
- Contains controllers, modules, and infrastructure layers

### Web (`apps/web`)
- Next.js application providing user interface
- Implements search and discovery features
- Communicates with API layer via HTTP requests
- Uses React components and Next.js app router
- Includes styling and UI components

## Packages Directory

### Database (`packages/database`)
- Drizzle ORM schema definitions
- Migration scripts for database changes
- Query helpers and utilities
- Connection management
- Type-safe database operations

### Inventory (`packages/inventory`)
- Core domain logic for inventory management
- Domain entities and value objects
- Repository interfaces and implementations
- Business rules and validation logic
- Service layer for inventory operations

### Shared (`packages/shared`)
- Shared contracts and interfaces
- Utility functions used across the project
- Common types and constants
- Reusable components or helpers

## Documentation

### docs/
- Architecture documentation
- Development guidelines
- Setup instructions
- API guidelines
- Database schema documentation
- Testing strategies
- Project structure overview

## GitHub Configuration

### .github/
- Issue templates (bug_report.md, feature_request.md)
- Pull request template (PULL_REQUEST_TEMPLATE.md)
- Discussion templates (if applicable)

## Environment Files

### .env.example
- Example environment variables for development
- Includes all required configuration parameters

### .env
- Local environment variables (not committed to version control)
- Contains secrets and local configuration

## Configuration Files

### package.json
- Root package with workspace definitions
- Scripts for building, testing, and development
- Project metadata

### turbo.json
- Turborepo configuration
- Task definitions and caching settings

### pnpm-workspace.yaml
- Workspace configuration for pnpm
- Defines which directories are part of the monorepo

## Build and Development Process

1. Run `pnpm install` to install all dependencies
2. Use `pnpm dev` to start development servers for both apps
3. Use `pnpm build` to build all packages and applications
4. Use `pnpm test` to run tests across the entire project
5. Use `pnpm lint` to check code quality
6. Use `pnpm format` to format code consistently

## Testing Strategy

Each package and application has its own test structure:
- Unit tests in the same directory as the code being tested
- Integration tests for component interactions
- End-to-end tests for complete workflows