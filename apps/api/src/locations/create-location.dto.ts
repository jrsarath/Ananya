export class CreateLocationDto {
  code!: string;
  name!: string;
  kind!: string;
  parentId?: string | null;
  metadata?: Record<string, unknown>;
}
