"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryProjection = void 0;
const core_1 = require("@ananya/core");
class InventoryProjection {
    id;
    componentId;
    locationId;
    quantity;
    unitOfMeasure;
    lastUpdated;
    constructor(id, componentId, locationId, quantity, unitOfMeasure, lastUpdated) {
        this.id = id;
        this.componentId = componentId;
        this.locationId = locationId;
        this.quantity = quantity;
        this.unitOfMeasure = unitOfMeasure;
        this.lastUpdated = lastUpdated;
    }
    static create(props) {
        return new InventoryProjection(props.id, props.componentId, props.locationId, props.quantity, props.unitOfMeasure, props.lastUpdated);
    }
    static createFromTransaction(componentId, locationId, quantity, unitOfMeasure, transactionType, timestamp) {
        return new InventoryProjection(core_1.ObjectId.generate().value, componentId, locationId, quantity, unitOfMeasure, timestamp);
    }
    // Getters for the properties
    getId() {
        return this.id;
    }
    getComponentId() {
        return this.componentId;
    }
    getLocationId() {
        return this.locationId;
    }
    getQuantity() {
        return this.quantity;
    }
    getUnitOfMeasure() {
        return this.unitOfMeasure;
    }
    getLastUpdated() {
        return this.lastUpdated;
    }
}
exports.InventoryProjection = InventoryProjection;
//# sourceMappingURL=inventory-projection.js.map