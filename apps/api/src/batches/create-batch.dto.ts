import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBatchDto {
  @IsString()
  componentId!: string;

  @IsString()
  batchNumber!: string;

  @IsOptional()
  @IsDateString()
  manufacturingDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  supplierBatchNumber?: string;
}
