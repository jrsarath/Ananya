import { Manufacturer } from './manufacturer';

export interface ManufacturerRepository {
  findById(id: string): Promise<Manufacturer | null>;
  findByCode(code: string): Promise<Manufacturer | null>;
  findAll(): Promise<Manufacturer[]>;
  save(manufacturer: Manufacturer): Promise<Manufacturer>;
}