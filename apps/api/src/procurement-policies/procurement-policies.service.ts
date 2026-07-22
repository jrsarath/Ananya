import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  ProcurementPolicy,
  ProcurementPolicyRepository,
} from '@ananya/procurement';
import { CreateProcurementPolicyDto } from './dtos';

export const PROCUREMENT_POLICY_REPOSITORY = 'PROCUREMENT_POLICY_REPOSITORY';

@Injectable()
export class ProcurementPoliciesService {
  constructor(
    @Inject(PROCUREMENT_POLICY_REPOSITORY)
    private readonly policyRepository: ProcurementPolicyRepository,
  ) {}

  async create(dto: CreateProcurementPolicyDto): Promise<ProcurementPolicy> {
    const policy = ProcurementPolicy.create(dto);
    await this.policyRepository.save(policy);
    return policy;
  }

  async findAll(): Promise<ProcurementPolicy[]> {
    return this.policyRepository.findAll();
  }

  async findOne(id: string): Promise<ProcurementPolicy> {
    const policy = await this.policyRepository.findById(id);
    if (!policy) {
      throw new NotFoundException(
        `Procurement Policy with ID ${id} not found.`,
      );
    }
    return policy;
  }
}
