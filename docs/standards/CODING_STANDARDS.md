# Coding Standards

This document outlines the coding standards and best practices for the Ananya project.

## Language and Frameworks

- Primary language: TypeScript
- Web framework: Next.js
- API framework: NestJS  
- Database: PostgreSQL with Drizzle ORM
- Package management: pnpm

## TypeScript Best Practices

### Type Safety
- Use strict TypeScript compilation
- Prefer explicit typing over inference when it improves readability
- Use interfaces for object shapes
- Utilize discriminated unions for complex data structures

### Code Structure
- Follow existing naming conventions (camelCase for variables, PascalCase for classes)
- Keep functions small and focused on a single responsibility
- Use descriptive function and variable names
- Avoid deeply nested code structures

### Error Handling
- Use TypeScript's built-in error handling patterns
- Implement proper error boundaries in UI components
- Log errors appropriately with context information
- Don't ignore promises or async operations

## Code Organization

### File Structure
- Group related functionality into modules
- Follow the existing project structure patterns
- Keep files focused and avoid monolithic files
- Use clear, descriptive file names

### Imports and Dependencies
- Organize imports in logical groups (standard library, external libraries, internal modules)
- Avoid circular dependencies
- Use relative paths for internal imports
- Import only what's needed from external libraries
- Never generate `.js` imports inside TypeScript source files
- Always use extensionless imports

## DTO Validation

- DTOs must always use class-validator decorators
- Controllers should only receive validated DTOs
- DTO validation is only for request shape and basic constraints
- Do not duplicate business validation already performed by the domain

## Documentation

### Inline Comments
- Document complex logic with clear comments
- Explain "why" not just "what"
- Keep comments up to date with code changes
- Use JSDoc for public APIs

### Code Examples
- Include code examples in documentation where appropriate
- Show real-world usage patterns
- Demonstrate edge cases and error conditions

## Testing Standards

### Test Coverage
- Aim for comprehensive test coverage of business logic
- Test both positive and negative scenarios
- Ensure all new features include tests
- Maintain existing tests when refactoring

### Test Structure
- Follow the existing testing patterns in the codebase
- Use descriptive test names
- Keep tests focused and fast
- Separate setup, execution, and assertion phases clearly

## General Principles

- Prefer readability over cleverness.
- Keep files focused on a single responsibility.
- Remove dead code instead of commenting it out.
- Keep public APIs intentional and minimal.
- Favor composition over duplication.
