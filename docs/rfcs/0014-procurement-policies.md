# RFC-0014: Procurement Policies

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-22

---

# 1. Purpose

This RFC defines **Procurement Policies** in Ananya ERP. Procurement Policies encapsulate business governance rules for Purchase Order approvals and receiving tolerances.

---

# 2. Scope

- Approval Tier Policies (Monetary threshold rules for automatic vs managerial PO approval).
- Receiving Tolerance Policies (Maximum allowed over-receipt and under-receipt percentages per component category or PO line).

---

# 3. Ubiquitous Language

- **Approval Tier**: A threshold defining required approval authority (e.g. `< $1,000` Auto-approve, `>= $1,000` Lead Engineer, `>= $10,000` Executive).
- **Over-receipt Tolerance**: Allowed excess quantity percentage above PO ordered quantity (e.g. 5% tolerance for reel/bulk items).
- **Under-receipt Tolerance**: Threshold below which a line is marked incomplete vs closed short.

---

# 4. Domain Model

```
+--------------------------------------------------------------------+
|                    Procurement Policy Aggregate                    |
|                                                                    |
| [Policy ID] (PK)                                                   |
|  - policyType: PolicyType (APPROVAL_TIER, RECEIVING_TOLERANCE)     |
|  - name: string                                                    |
|  - thresholdAmount: Money?                                         |
|  - overReceiptTolerancePercent: number?                            |
|  - requiresExecutiveApproval: boolean                              |
|  - isActive: boolean                                               |
+--------------------------------------------------------------------+
```

---

# 5. Aggregate Roots

- **`ProcurementPolicy`**: Root entity managing policy thresholds and governance checks.

---

# 6. Entities

- Standard policy properties.

---

# 7. Value Objects

- **`PolicyType`**: Enum (`APPROVAL_TIER`, `RECEIVING_TOLERANCE`).

---

# 8. Commands

- `CreateProcurementPolicyCommand`: Defines a new policy rule.
- `UpdateProcurementPolicyCommand`: Modifies threshold limits or percentages.

---

# 9. Queries

- `GetActiveProcurementPoliciesQuery`: Retrieves active policy rules for evaluation.

---

# 10. Application Services

- **`ProcurementPolicyApplicationService`**: Evaluates POs against approval thresholds and Goods Receipts against tolerance rules.

---

# 11. Domain Services

- **`PoApprovalEvaluator`**: Determines approval routing based on active policies.
- **`OverReceiptToleranceChecker`**: Enforces receiving limits.

---

# 12. State Machines

- Policies maintain `ACTIVE` or `INACTIVE` state.

---

# 13. Domain Invariants

- Tolerance percentages must be non-negative numbers (`0% to 100%`).
- Threshold amounts must be positive values (`> 0`).

---

# 14. Integration Points

- Evaluated during Purchase Order submission and Goods Receipt creation.

---

# 15. Repository Contracts

```typescript
export interface ProcurementPolicyRepository {
  findById(id: string): Promise<ProcurementPolicy | null>;
  findAll(): Promise<ProcurementPolicy[]>;
  save(policy: ProcurementPolicy): Promise<void>;
}
```

---

# 16. Database Schema

```sql
CREATE TABLE procurement_policies (
  id VARCHAR(36) PRIMARY KEY,
  policy_type VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  threshold_amount NUMERIC(14, 4) DEFAULT 0.0000,
  over_receipt_tolerance_percent NUMERIC(5, 2) DEFAULT 0.00,
  requires_executive_approval BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 17. API Specification

- `GET /api/v1/procurement-policies`: Get configured policies.
- `POST /api/v1/procurement-policies`: Create policy.
- `PUT /api/v1/procurement-policies/:id`: Update policy.

---

# 18. UI Workflows

1. **Procurement Policy Settings**: Configure monetary approval thresholds and over-receipt percentage limits.

---

# 19. Sequence Diagrams

```
PO Service -> Policy Evaluator: evaluateApprovalNeed(po.grandTotal)
Policy Evaluator -> Policy Repo: getActivePolicies()
Policy Evaluator -> PO Service: ApprovalRequirement { requiresApproval: true, tier: "LEAD" }
```

---

# 20. Future Extensions

- Category-specific over-receipt tolerances (e.g. passive components vs high-cost microcontrollers).
