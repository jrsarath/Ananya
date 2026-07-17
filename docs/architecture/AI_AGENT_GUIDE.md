# Ananya AI Agent Guide

> This document defines how AI coding agents collaborate on the Ananya project.
>
> It is intended for GitHub Copilot, Qwen Coder, Claude Code, ChatGPT, and future AI assistants.
>
> Following these guidelines is mandatory.

---

# Team Roles

The project operates with three roles.

## Product Owner

Responsibilities:

- Defines product vision.
- Makes architectural decisions.
- Resolves business questions.
- Approves breaking changes.
- Sets priorities.

The Product Owner should **not** be interrupted for routine implementation decisions.

---

## Architect

Responsibilities:

- Defines architecture.
- Reviews pull requests.
- Protects long-term maintainability.
- Ensures consistency across bounded contexts.
- Rejects architectural drift.

The Architect is responsible for keeping the codebase coherent over time.

---

## Implementation Agent

Responsibilities:

- Implements requested changes.
- Follows established conventions.
- Does not redesign architecture.
- Does not introduce new patterns.
- Stops when architectural decisions are required.

The implementation agent is responsible for execution, not architecture.

---

# Decision Making

AI agents should make decisions only when they are implementation details.

Examples:

- variable names
- helper function extraction
- file organization
- formatting
- imports
- mapper implementation

AI agents should **not** make decisions about:

- architecture
- bounded contexts
- aggregate boundaries
- repository contracts
- public APIs
- domain models
- persistence strategy

Those require Product Owner or Architect approval.

---

# When To Stop

Stop immediately if a task requires:

- introducing a new architectural pattern
- changing repository contracts
- changing aggregate responsibilities
- modifying public APIs
- changing persistence strategy
- changing event flow
- changing domain behavior

Instead, explain the decision that needs approval.

---

# Follow Existing Conventions

Always prefer consistency over creativity.

If three repositories already follow a pattern, the fourth should follow the same pattern.

Do not introduce "better" patterns without approval.

Consistency is more valuable than novelty.

---

# DDD First

Always read:

```
docs/architecture/ddd.md
```

before implementing domain changes.

If implementation conflicts with the DDD document, the implementation is wrong.

---

# Repository Rules

Repositories:

- persist aggregates
- never persist DTOs
- never contain business rules
- never generate identities
- never generate timestamps

Repositories translate.

They do not decide business behavior.

---

# Aggregate Rules

Aggregates:

- own validation
- own invariants
- own normalization
- own identity
- own timestamps
- own business behavior

Every aggregate exposes:

```
create()

rehydrate()
```

Nothing else constructs aggregates.

---

# Application Services

Application services coordinate.

They should look like:

```
Load

↓

Call aggregate

↓

Persist

↓

Return
```

If an application service contains business logic, move that logic into the domain.

---

# Infrastructure

Infrastructure adapts.

Infrastructure should never define business rules.

Infrastructure should never modify domain behavior.

---

# Keep Changes Small

Modify only what is necessary.

Avoid unrelated refactoring.

Avoid formatting-only commits.

Avoid renaming files without approval.

Avoid introducing utilities unless repetition already exists.

---

# Architectural Debt

Do not leave architectural debt behind.

If implementing a feature requires violating architecture:

Stop.

Raise the issue.

Do not implement the shortcut.

---

# Comments

Avoid obvious comments.

Good comments explain **why**.

Bad comments explain **what**.

Prefer expressive code over explanatory comments.

---

# Testing

When making changes:

- ensure existing tests continue to pass
- add tests for new domain behavior
- avoid brittle implementation-based tests

Tests should validate behavior.

Not implementation.

---

# Verification

Before considering a task complete, run:

```
pnpm check-types

pnpm lint

pnpm build
```

The task is not complete until all succeed.

---

# Communication

When reporting work:

Report only:

- what changed
- why it changed
- any architectural decisions requiring approval

Do not report:

- every file modified
- routine implementation details
- formatting changes
- self-congratulation

Keep updates concise and actionable.

---

# Pull Requests

A pull request should contain one logical change.

Do not mix:

- refactoring
- architecture
- feature work
- formatting
- dependency updates

Each should be reviewed independently.

---

# Review Philosophy

Assume every line of code will be maintained for years.

Optimize for:

- readability
- consistency
- explicitness
- long-term maintainability

Do not optimize for writing the fewest lines of code.

---

# Guiding Principle

Before writing code, ask:

> "What is the simplest implementation that fully respects the existing architecture?"

Implement that.

Nothing more.

Nothing less.