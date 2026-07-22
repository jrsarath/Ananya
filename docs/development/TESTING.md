# Testing

This document describes how changes are currently validated in Ananya.

## Required Quality Gates

Every pull request should pass the following commands.

```bash
pnpm check-types
pnpm lint
pnpm build
```

These verify:

- Type correctness
- Coding standards
- Successful production builds

## Current State

Automated testing is being introduced incrementally.

Until the testing infrastructure is established, the quality gates above are required for every change.

## Future Direction

This document will expand as the project grows to cover:

- Unit testing
- Integration testing
- End-to-end testing
- Test coverage
- Testing conventions

These sections will be documented when the corresponding tooling and workflows become part of the repository.
