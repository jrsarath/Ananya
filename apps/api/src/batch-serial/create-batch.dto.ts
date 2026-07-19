import { IsNotEmpty, IsString, MaxLength, IsUUID, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateBatchDto {
  @IsUUID()
  @IsNotEmpty()
  componentId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  batchNumber!: string;

  @IsNumber()
  @Min(0.000001)
  @IsNotEmpty()
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  unitOfMeasure!: string;

  @IsUUID()
  @IsNotEmpty()
  locationId!: string;

  @IsOptional()
  @IsDateString()
  manufactureDate?: Date;

  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  supplierReference?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  receivedBy!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
