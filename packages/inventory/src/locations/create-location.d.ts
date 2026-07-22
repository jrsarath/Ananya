import { Location, type CreateLocationInput } from "./location";
import type { LocationRepository } from "./location.repository";
export declare class CreateLocation {
    private readonly locations;
    constructor(locations: LocationRepository);
    execute(input: CreateLocationInput): Promise<Location>;
}
//# sourceMappingURL=create-location.d.ts.map