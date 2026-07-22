import { Location } from "./location";
export interface FindManyLocationsOptions {
}
export interface LocationRepository {
    findById(id: string): Promise<Location | null>;
    findByCode(code: string): Promise<Location | null>;
    findMany(options?: FindManyLocationsOptions): Promise<Location[]>;
    save(location: Location): Promise<Location>;
}
//# sourceMappingURL=location.repository.d.ts.map