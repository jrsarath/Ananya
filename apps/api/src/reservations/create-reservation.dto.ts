import { IsNotEmpty, IsString, MaxLength, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  @IsNotEmpty()
  componentId!: string;

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

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  businessReference!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  reservedBy!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  expiry?: Date;
}
