# Development

This section contains documentation for contributors developing Ananya.

## Documents

### Setup

Prepare a local development environment.

→ [SETUP.md](SETUP.md)

---

### Local Development

Run the applications and supporting infrastructure locally.

→ [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)

---

### Testing

Quality gates, validation commands, and testing practices.

→ [TESTING.md](TESTING.md)

---

## Development Workflow

Before opening a pull request, ensure the repository passes all engineering quality gates.

```bash
pnpm check-types
pnpm lint
pnpm build
```

Then review:

- [Engineering Standards](../standards/ENGINEERING.md)
- [Pull Request Review Checklist](../standards/PR_REVIEW_CHECKLIST.md)
- [Contributing Guide](../../CONTRIBUTING.md)