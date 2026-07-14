# Local Development Guide

This document provides detailed instructions for local development within the Ananya project.

## Setting Up Your Environment

### Prerequisites
- Node.js 18+ (use nvm for version management)
- pnpm 8+ 
- Docker and Docker Compose
- PostgreSQL 13+

### Initial Setup
```bash
# Clone repository
git clone https://github.com/48studios/ananya.git
cd ananya

# Install dependencies
pnpm install

# Start database
docker-compose up -d

# Run migrations
pnpm db:migrate
```

## Development Workflow

### Running Applications
The project uses Turborepo for managing multiple applications:

```bash
# Start both applications in development mode
pnpm dev

# Start API only
pnpm api:dev

# Start Web application only  
pnpm web:dev
```

### Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Key environment variables include:
- DATABASE_URL - PostgreSQL connection string
- JWT_SECRET - Secret for JWT token generation
- API_PORT - Port for API server
- WEB_PORT - Port for web application

## Development Tools

### Code Quality
- TypeScript compilation and type checking: `pnpm type-check`
- Linting with ESLint: `pnpm lint` 
- Formatting with Prettier: `pnpm format`

### Testing
```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- <path-to-test-file>

# Watch mode for tests
pnpm test:watch
```

## Debugging

### API Debugging
Use VS Code debugger configuration:
1. Set breakpoints in NestJS controllers or services
2. Launch debug configuration for API
3. Make requests to the API endpoints

### Web Application Debugging
1. Set breakpoints in React components or Next.js pages
2. Launch debug configuration for web application  
3. Navigate to web interface in browser

## Database Development

### Migrations
```bash
# Create new migration
pnpm db:generate-migration <migration-name>

# Run migrations
pnpm db:migrate

# Rollback migrations
pnpm db:rollback
```

### Seeding Data
```bash
# Seed database with test data
pnpm db:seed
```

## Branching Strategy

### Git Workflow
1. Create feature branches from `main`
2. Follow semantic commit messages
3. Keep commits focused and atomic
4. Rebase feature branches before merging

### Feature Branch Naming
- `feature/<description>` - New features
- `bugfix/<description>` - Bug fixes  
- `hotfix/<description>` - Urgent fixes
- `docs/<description>` - Documentation changes

## Code Standards During Development

### Commit Messages
Follow conventional commits:
```
feat: add new inventory transaction type
fix: resolve database connection issue
docs: update API documentation
style: format code according to standards
refactor: restructure inventory service
test: add tests for edge cases
```

### Pull Request Process
1. Create a descriptive pull request
2. Reference related issues
3. Include testing information
4. Ensure all checks pass
5. Request review from maintainers

## Troubleshooting

### Common Issues
- **Database connection errors**: Ensure Docker is running and `docker-compose up -d` has been executed
- **Dependency installation failures**: Try `pnpm install --force`
- **Port conflicts**: Check if ports 3000 (API) and 3001 (Web) are available
- **TypeScript errors**: Run `pnpm type-check` to identify issues

### Development Tips
- Use `pnpm turbo` for optimized build processes
- Leverage VS Code's TypeScript integration for better development experience
- Utilize the built-in API documentation at `/api/docs` during development
