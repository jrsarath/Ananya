import { ObjectId } from "@ananya/core";

export type PolicyType = "APPROVAL_TIER" | "RECEIVING_TOLERANCE";

export interface ProcurementPolicyProps {
  id: string;
  policyType: PolicyType;
  name: string;
  thresholdAmount?: number | null;
  overReceiptTolerancePercent?: number | null;
  requiresExecutiveApproval: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProcurementPolicyInput {
  policyType: PolicyType;
  name: string;
  thresholdAmount?: number | null;
  overReceiptTolerancePercent?: number | null;
  requiresExecutiveApproval?: boolean;
}

export class ProcurementPolicy {
  public readonly id: string;
  public readonly policyType: PolicyType;
  public readonly name: string;
  public readonly thresholdAmount?: number | null;
  public readonly overReceiptTolerancePercent?: number | null;
  public readonly requiresExecutiveApproval: boolean;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: ProcurementPolicyProps) {
    this.id = props.id;
    this.policyType = props.policyType;
    this.name = props.name;
    this.thresholdAmount = props.thresholdAmount;
    this.overReceiptTolerancePercent = props.overReceiptTolerancePercent;
    this.requiresExecutiveApproval = props.requiresExecutiveApproval;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(input: CreateProcurementPolicyInput): ProcurementPolicy {
    const id = ObjectId.generate().value;
    const createdAt = new Date();

    return new ProcurementPolicy({
      id,
      policyType: input.policyType,
      name: input.name.trim(),
      thresholdAmount: input.thresholdAmount ?? 0,
      overReceiptTolerancePercent: input.overReceiptTolerancePercent ?? 0,
      requiresExecutiveApproval: input.requiresExecutiveApproval ?? false,
      isActive: true,
      createdAt,
      updatedAt: createdAt,
    });
  }

  public static rehydrate(props: ProcurementPolicyProps): ProcurementPolicy {
    return new ProcurementPolicy(props);
  }
}
