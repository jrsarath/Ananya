# Ananya Code Review Checklist

> Every pull request must satisfy this checklist before approval.
>
> The goal of a review is **not** to find bugs.
> The goal is to ensure the implementation aligns with Ananya's architecture.

---

# 1. Domain

- [ ] Business rules live inside the domain.
- [ ] Aggregates protect their own invariants.
- [ ] Domain terminology follows the ubiquitous language.
- [ ] No persistence concerns leak into the domain.
- [ ] No framework-specific code exists in the domain.

---

# 2. Application

- [ ] Application services only orchestrate.
- [ ] No business rules exist in application services.
- [ ] No IDs are generated in application services.
- [ ] No timestamps are generated in application services.
- [ ] Application services do not construct persistence models.

---

# 3. Aggregates

- [ ] Aggregate exposes `create()`.
- [ ] Aggregate exposes `rehydrate()`.
- [ ] Aggregate owns identity.
- [ ] Aggregate owns timestamps.
- [ ] Aggregate is valid after construction.
- [ ] Public state is immutable.
- [ ] Business behavior belongs on the aggregate.

---

# 4. Repositories

- [ ] Repository persists aggregates.
- [ ] Repository never accepts DTOs.
- [ ] Repository interface exposes:
  - [ ] `findById()`
  - [ ] `findMany(options?)`
  - [ ] `save()`
- [ ] Repository hides persistence implementation.
- [ ] Repository does not implement business rules.

---

# 5. Infrastructure

- [ ] Infrastructure maps between persistence and domain.
- [ ] Loading uses `Aggregate.rehydrate()`.
- [ ] Saving converts aggregates into persistence rows.
- [ ] Infrastructure does not fabricate domain objects.
- [ ] Persistence details do not leak outside infrastructure.

---

# 6. Error Handling

- [ ] Business failures use `DomainError`.
- [ ] Infrastructure failures remain infrastructure errors.
- [ ] No generic `Error` is thrown for domain failures.

---

# 7. API Consistency

- [ ] Naming follows existing project conventions.
- [ ] Similar concepts follow similar implementations.
- [ ] No duplicate architectural patterns exist.
- [ ] New code feels consistent with the surrounding bounded context.

---

# 8. Maintainability

- [ ] Code is understandable without additional explanation.
- [ ] Responsibilities are obvious.
- [ ] There are no temporary workarounds.
- [ ] There are no TODOs for architectural debt.

---

# 9. Verification

- [ ] `pnpm check-types`
- [ ] `pnpm lint`
- [ ] `pnpm build`

must all pass before review is complete.

---

# 10. Final Question

Before approving, ask one question:

> **Would I be comfortable maintaining this implementation for the next five years?**

If the answer is **no**, the pull request is **not ready**.

---

# Review Philosophy

Code is not approved because it works.

Code is approved because it:

- expresses the domain,
- follows the architecture,
- is maintainable,
- and allows future features to be added without redesign.

Correct architecture is a feature.
