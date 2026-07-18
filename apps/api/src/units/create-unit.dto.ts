import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category!: string;

  @IsNotEmpty()
  isBaseUnit!: boolean;

  @IsOptional()
  @IsNumber()
  conversionFactor?: number;

  @IsNumber()
  @IsNotEmpty()
  precision!: number;
}