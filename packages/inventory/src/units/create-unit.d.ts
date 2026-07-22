import { Unit, type CreateUnitInput } from "./unit";
import type { UnitRepository } from "./unit.repository";
export declare class CreateUnit {
    private readonly units;
    constructor(units: UnitRepository);
    execute(input: CreateUnitInput): Promise<Unit>;
}
//# sourceMappingURL=create-unit.d.ts.map