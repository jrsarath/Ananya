import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}
