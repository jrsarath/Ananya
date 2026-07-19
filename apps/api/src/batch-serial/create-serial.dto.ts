import { IsNotEmpty, IsString, MaxLength, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateSerialDto {
  @IsUUID()
  @IsNotEmpty()
  componentId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  serialNumber!: string;

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

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  receivedBy!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
