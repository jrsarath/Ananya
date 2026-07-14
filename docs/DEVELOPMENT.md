# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: LTS version)
- pnpm 9+
- Docker (for local database setup)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run coverage
pnpm test:cov

# Run e2e tests
pnpm test:e2e
```

### Building the Project

```bash
# Build all apps and packages
pnpm build

# Build specific package
pnpm build --filter=api
pnpm build --filter=web
```

### Linting and Formatting

```bash
# Run linter
pnpm lint

# Format code
pnpm format
```

## Project Structure

The project follows a Turborepo structure with:

- `apps/` - Application code (api, web)
- `packages/` - Shared packages (database, inventory, shared)
- `docs/` - Documentation files

### API Layer (`apps/api`)
- Contains NestJS application
- Implements RESTful endpoints
- Uses dependency injection for services
- Handles request validation with Zod

### Web Layer (`apps/web`)
- Next.js application
- Provides user interface
- Communicates with API layer
- Implements search and discovery features

### Database Package (`packages/database`)
- Drizzle ORM schema definitions
- Migration scripts
- Query helpers

### Inventory Package (`packages/inventory`)
- Domain logic for inventory management
- Repository interfaces and implementations
- Business rules and validation

## Environment Variables

Environment variables are managed through `.env` files. The following variables are required:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token generation
- `NODE_ENV` - Application environment (development, production)

## Testing Strategy

### Unit Tests
- Test individual functions and methods
- Located in the same directory as the code being tested
- Use Jest framework

### Integration Tests
- Test interactions between components
- Verify API endpoints work correctly
- Use NestJS testing utilities

### End-to-End Tests
- Test complete user workflows
- Use Supertest for HTTP requests
- Run against a test database

## Code Quality

### TypeScript
- All code is written in TypeScript
- Strict type checking is enabled
- Type definitions are used throughout

### ESLint and Prettier
- Code is linted with ESLint
- Formatted with Prettier
- Configuration follows project standards

### Documentation
- JSDoc comments for public APIs
- Inline comments for complex logic
- README files in each package

## Contributing

Please read the [CONTRIBUTING.md](../CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## Debugging

### API Layer Debugging
Use VS Code debugger with the `launch.json` configuration to debug NestJS applications.

### Web Layer Debugging
Use browser developer tools to debug Next.js application.

### Database Debugging
Use Drizzle Studio or psql to inspect database contents during development.