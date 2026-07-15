# Ananya Engineering Platform

## Overview

This repository contains the internal operations system for 48 Studios, called Ananya. It's a modular monorepo built with Turborepo, TypeScript, Next.js, NestJS, and PostgreSQL.

## Architecture

Ananya follows a modular monolith architecture with clear domain boundaries:

- `apps/` - Application code (web, api)
- `packages/` - Shared packages (database, inventory, core, shared)
- `docs/` - Documentation
- `examples/` - Examples demonstrating module usage

## Core Engineering Principles

1. **Separation of Concerns**: Domain logic is separated from data access and presentation layers
2. **Type Safety**: Strong TypeScript typing throughout the codebase
3. **Error Handling**: Consistent error handling using DomainError hierarchy from @ananya/core
4. **Repository Pattern**: Clean abstraction for data access operations
5. **Dependency Direction**: 
   ```
   Web Application → API Layer → Domain Modules → Database Abstractions → PostgreSQL
   ```

## Package Structure

### Core Packages

- `@ananya/core`: Contains shared engineering concepts like DomainError hierarchy and ObjectId value object
- `@ananya/database`: Database schema and persistence infrastructure  
- `@ananya/inventory`: Inventory domain logic
- `@ananya/shared`: Shared contracts and utilities

## Coding Standards

### Naming Conventions

- PascalCase for classes, interfaces, and types
- camelCase for variables and functions
- UPPER_CASE for constants
- Prefix abstract classes with `Abstract`
- Suffix error classes with `Error`

### Error Handling

All domain errors should extend the `DomainError` class from `@ananya/core`. This ensures consistent error handling across the application.

### Type Safety

Prefer explicit typing over inference where it improves readability. Use interfaces for object shapes and types for primitive values.

## Development Workflow

1. Run `pnpm install` to set up dependencies
2. Use `pnpm build` to build all packages
3. Use `pnpm dev` to start development servers
4. Follow the existing code structure and patterns when adding new features

## Repository Conventions

- Never generate `.js` imports in TypeScript source files.
- Always use extensionless imports.
- Follow the shared TypeScript configuration.
- Every NestJS DTO must use `class-validator`.
- Keep controllers thin.
- Keep business logic in domain use cases.
- Keep repositories persistence-only.
- Never introduce framework dependencies into domain packages.
- Always update public exports (`index.ts`) when adding a new module.
- Always ensure `pnpm check-types`, `pnpm lint`, and `pnpm build` pass before considering work complete.

## Testing

All domain logic must be unit tested. Integration tests should cover repository implementations and API endpoints.

## Documentation

Each package should include a README.md explaining its purpose, usage, and public APIs.