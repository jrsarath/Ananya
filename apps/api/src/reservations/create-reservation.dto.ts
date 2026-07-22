import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  componentId!: string;

  @IsString()
  locationId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsString()
  unitOfMeasure!: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsString()
  reservedBy!: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
