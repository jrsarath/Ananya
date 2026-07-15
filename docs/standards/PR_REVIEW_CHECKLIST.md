# Pull Request Review Checklist

## Repository

- [ ] check-types passes
- [ ] lint passes
- [ ] build passes

## Architecture

- [ ] follows canonical module structure
- [ ] no dependency violations
- [ ] public exports updated

## Domain

- [ ] business rules implemented
- [ ] no framework dependencies
- [ ] domain-specific errors

## Infrastructure

- [ ] repository implementation only
- [ ] no business logic

## API

- [ ] thin controllers
- [ ] orchestration in services only

## Documentation

- [ ] PROJECT_STATUS updated
- [ ] migrations included if required