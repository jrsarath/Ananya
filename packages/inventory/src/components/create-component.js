"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComponent = void 0;
const component_1 = require("./component");
const component_errors_1 = require("./component.errors");
class CreateComponent {
    components;
    constructor(components) {
        this.components = components;
    }
    async execute(input) {
        // Normalize input for uniqueness check (the aggregate will normalize again)
        const sku = input.sku.trim().toLowerCase();
        const existing = await this.components.findBySku(sku);
        if (existing) {
            throw new component_errors_1.ComponentSkuAlreadyExistsError(sku);
        }
        // Create the component using factory method
        const component = component_1.Component.create(input);
        // Persist the aggregate
        return this.components.save(component);
    }
}
exports.CreateComponent = CreateComponent;
//# sourceMappingURL=create-component.js.map