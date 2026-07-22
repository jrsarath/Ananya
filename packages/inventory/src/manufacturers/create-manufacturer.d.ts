import { Manufacturer, type CreateManufacturerInput } from "./manufacturer";
import type { ManufacturerRepository } from "./manufacturer.repository";
export declare class CreateManufacturer {
    private readonly manufacturers;
    constructor(manufacturers: ManufacturerRepository);
    execute(input: CreateManufacturerInput): Promise<Manufacturer>;
}
//# sourceMappingURL=create-manufacturer.d.ts.map