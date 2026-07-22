# Contributing to Ananya

Thank you for your interest in contributing to Ananya.

This document describes the contribution workflow used by the project.

Before contributing, please familiarize yourself with the project documentation in the `docs/` directory.

---

# Development Workflow

Every contribution should follow the same workflow.

```
Implement
        ↓
check-types
        ↓
lint
        ↓
build
        ↓
PR Review Checklist
        ↓
Open Pull Request
```

The repository should remain in a buildable state after every change.

---

# Before You Begin

Please review the following documents before making significant changes:

- `docs/architecture/ARCHITECTURE.md`
- `docs/architecture/PROJECT_STRUCTURE.md`
- `docs/standards/ENGINEERING.md`
- `docs/standards/CODING_STANDARDS.md`
- `docs/standards/PR_REVIEW_CHECKLIST.md`

---

# Setting Up

Follow the setup instructions in:

- `docs/development/SETUP.md`

For day-to-day development, see:

- `docs/development/LOCAL_DEVELOPMENT.md`

---

# Quality Gates

Every contribution should successfully complete:

```bash
pnpm check-types
pnpm lint
pnpm build
```

Pull requests should not be opened unless these commands pass successfully.

---

# Pull Requests

Keep pull requests focused on a single logical change.

A pull request should:

- Have a clear title and description.
- Explain the motivation for the change.
- Reference related issues or RFCs where applicable.
- Pass all required quality gates.
- Follow the PR Review Checklist.

---

# Coding Standards

Follow the project's documented standards.

See:

- `docs/standards/ENGINEERING.md`
- `docs/standards/CODING_STANDARDS.md`

When introducing a new domain module or package, also review:

- `docs/standards/NEW_MODULE.md`
- `docs/standards/NEW_PACKAGE.md`

---

# Architectural Changes

Significant architectural or domain changes should be discussed before implementation.

If a change affects:

- architecture,
- domain modelling,
- persistence,
- public APIs,
- or long-term engineering direction,

create or update an RFC in:

```
docs/rfcs/
```

before implementation begins.

---

# Reporting Issues

When reporting a bug, include:

- a clear description of the problem,
- steps to reproduce,
- expected behaviour,
- actual behaviour,
- relevant logs or screenshots where appropriate.

Please search existing issues before opening a new one.

---

# Community

Please be respectful, constructive, and collaborative.

All contributors are expected to follow the project's Code of Conduct.
