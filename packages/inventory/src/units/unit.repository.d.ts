import { Unit } from "./unit";
export interface FindManyUnitsOptions {
}
export interface UnitRepository {
    findById(id: string): Promise<Unit | null>;
    findByName(name: string): Promise<Unit | null>;
    findByCategory(category: string): Promise<Unit[]>;
    findMany(options?: FindManyUnitsOptions): Promise<Unit[]>;
    save(unit: Unit): Promise<Unit>;
}
//# sourceMappingURL=unit.repository.d.ts.map