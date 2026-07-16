import { Location } from './location';

export interface LocationRepository {
  findById(id: string): Promise<Location | null>;
  findByCode(code: string): Promise<Location | null>;
  findAll(): Promise<Location[]>;
  save(location: Location): Promise<Location>;
}
