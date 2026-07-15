export class CreateComponentDto {
  sku!: string;
  name!: string;
  description?: string;
  manufacturerId?: string | undefined;
  categoryId?: string | undefined;
  defaultLocationId?: string | undefined;
  unit!: string;
}
