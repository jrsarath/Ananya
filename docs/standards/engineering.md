# Engineering Standards

## Overview

This document outlines the engineering standards and conventions used in the Ananya codebase. These standards ensure consistency, maintainability, and scalability across all modules.

## TypeScript Conventions

### Naming Conventions

- Use PascalCase for classes, interfaces, and types
- Use camelCase for variables and functions
- Use UPPER_CASE for constants
- Prefix abstract classes with `Abstract`
- Suffix error classes with `Error`

### Error Handling

All domain errors should extend the `DomainError` class from `@ananya/core`. This ensures consistent error handling across the application.

### Type Safety

Prefer explicit typing over inference where it improves readability. Use interfaces for object shapes and types for primitive values.

## Package Structure

### Core Packages

- `@ananya/core`: Contains shared engineering concepts like DomainError hierarchy and ObjectId value object
- `@ananya/database`: Database schema and persistence infrastructure
- `@ananya/inventory`: Inventory domain logic
- `@ananya/shared`: Shared contracts and utilities

## Code Organization

### Modules

Each module should have a clear boundary and responsibility. Modules should not directly depend on other modules in the same layer.

### Dependency Direction

```
Web Application → API Layer → Domain Modules → Database Abstractions → PostgreSQL
```

### Repository Pattern

- Repositories are interfaces that define data access contracts
- Implementations are provided by database packages
- No direct database access in domain modules

## Testing

All domain logic must be unit tested. Integration tests should cover repository implementations and API endpoints.

## Documentation

Each package should include a README.md explaining its purpose, usage, and public APIs.