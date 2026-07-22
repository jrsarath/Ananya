import { ProcurementPolicy } from "./procurement-policy";

export interface ProcurementPolicyRepository {
  findById(id: string): Promise<ProcurementPolicy | null>;
  findAll(): Promise<ProcurementPolicy[]>;
  save(policy: ProcurementPolicy): Promise<void>;
}
