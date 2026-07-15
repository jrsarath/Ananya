import type { Manufacturer, CreateManufacturerInput } from './manufacturer';

export interface ManufacturerRepository {
  findById(id: string): Promise<Manufacturer | null>;
  findByCode(code: string): Promise<Manufacturer | null>;
  findAll(): Promise<Manufacturer[]>;

  create(input: CreateManufacturerInput): Promise<Manufacturer>;
}