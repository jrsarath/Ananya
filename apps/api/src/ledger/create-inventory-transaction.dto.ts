import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateInventoryTransactionDto {
  @IsString()
  @IsNotEmpty()
  componentId!: string;

  @IsNumber()
  @Min(0.000001)
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  unitOfMeasure!: string;

  @IsString()
  @IsNotEmpty()
  locationId!: string;

  @IsString()
  @IsNotEmpty()
  transactionType!: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  batchId?: string;

  @IsString()
  @IsOptional()
  serialId?: string;

  @IsString()
  @IsOptional()
  reservationId?: string;

  @IsString()
  @IsNotEmpty()
  performedBy!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
