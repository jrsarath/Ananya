import { IsOptional, IsString } from 'class-validator';

export class CreateSerialDto {
  @IsString()
  componentId!: string;

  @IsString()
  serialNumber!: string;

  @IsOptional()
  @IsString()
  locationId?: string;
}
