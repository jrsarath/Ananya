import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { PolicyType } from '@ananya/procurement';

export class CreateProcurementPolicyDto {
  @IsString()
  @IsNotEmpty()
  policyType!: PolicyType;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsOptional()
  thresholdAmount?: number;

  @IsNumber()
  @IsOptional()
  overReceiptTolerancePercent?: number;

  @IsBoolean()
  @IsOptional()
  requiresExecutiveApproval?: boolean;
}
