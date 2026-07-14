import type {
  CreateLocationInput,
  Location,
} from "./location.js";

export interface LocationRepository {
  findById(id: string): Promise<Location | null>;
  findByCode(code: string): Promise<Location | null>;

  create(input: CreateLocationInput): Promise<Location>;
}
