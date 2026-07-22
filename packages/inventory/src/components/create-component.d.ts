import { Component, type CreateComponentInput } from "./component";
import type { ComponentRepository } from "./component.repository";
export declare class CreateComponent {
    private readonly components;
    constructor(components: ComponentRepository);
    execute(input: CreateComponentInput): Promise<Component>;
}
//# sourceMappingURL=create-component.d.ts.map