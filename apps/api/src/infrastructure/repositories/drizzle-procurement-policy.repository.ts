import { db } from '@ananya/database';
import { procurementPolicies } from '@ananya/database/schema';
import { eq } from '@ananya/database/query';
import type { ProcurementPolicyRecord } from '@ananya/database/schema';
import {
  ProcurementPolicy,
  ProcurementPolicyRepository,
  PolicyType,
} from '@ananya/procurement';

function toDomain(row: ProcurementPolicyRecord): ProcurementPolicy {
  return ProcurementPolicy.rehydrate({
    id: row.id,
    policyType: row.policyType as PolicyType,
    name: row.name,
    thresholdAmount: row.thresholdAmount
      ? parseFloat(row.thresholdAmount)
      : null,
    overReceiptTolerancePercent: row.overReceiptTolerancePercent
      ? parseFloat(row.overReceiptTolerancePercent)
      : null,
    requiresExecutiveApproval: row.requiresExecutiveApproval ?? false,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class DrizzleProcurementPolicyRepository implements ProcurementPolicyRepository {
  async findById(id: string): Promise<ProcurementPolicy | null> {
    const [row] = await db
      .select()
      .from(procurementPolicies)
      .where(eq(procurementPolicies.id, id))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<ProcurementPolicy[]> {
    const rows = await db.select().from(procurementPolicies);
    return rows.map(toDomain);
  }

  async save(policy: ProcurementPolicy): Promise<void> {
    await db
      .insert(procurementPolicies)
      .values({
        id: policy.id,
        policyType: policy.policyType,
        name: policy.name,
        thresholdAmount: policy.thresholdAmount?.toString() ?? '0.0000',
        overReceiptTolerancePercent:
          policy.overReceiptTolerancePercent?.toString() ?? '0.00',
        requiresExecutiveApproval: policy.requiresExecutiveApproval,
        isActive: policy.isActive,
      })
      .onConflictDoUpdate({
        target: procurementPolicies.id,
        set: {
          name: policy.name,
          thresholdAmount: policy.thresholdAmount?.toString() ?? '0.0000',
          overReceiptTolerancePercent:
            policy.overReceiptTolerancePercent?.toString() ?? '0.00',
          requiresExecutiveApproval: policy.requiresExecutiveApproval,
          isActive: policy.isActive,
          updatedAt: new Date(),
        },
      });
  }
}
