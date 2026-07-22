import { Module } from '@nestjs/common';
import { ProcurementPoliciesController } from './procurement-policies.controller';
import {
  ProcurementPoliciesService,
  PROCUREMENT_POLICY_REPOSITORY,
} from './procurement-policies.service';
import { DrizzleProcurementPolicyRepository } from '../infrastructure/repositories/drizzle-procurement-policy.repository';

@Module({
  controllers: [ProcurementPoliciesController],
  providers: [
    ProcurementPoliciesService,
    {
      provide: PROCUREMENT_POLICY_REPOSITORY,
      useClass: DrizzleProcurementPolicyRepository,
    },
  ],
  exports: [ProcurementPoliciesService],
})
export class ProcurementPoliciesModule {}
