"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serial = void 0;
const core_1 = require("@ananya/core");
class Serial {
    id;
    componentId;
    serialNumber;
    locationId;
    createdAt;
    constructor(props) {
        this.id = props.id;
        this.componentId = props.componentId;
        this.serialNumber = props.serialNumber;
        this.locationId = props.locationId;
        this.createdAt = props.createdAt;
    }
    static create(input) {
        if (!input.serialNumber || input.serialNumber.trim() === "") {
            throw new Error("Serial number is required");
        }
        if (!input.componentId || input.componentId.trim() === "") {
            throw new Error("Component ID is required");
        }
        const id = core_1.ObjectId.generate().value;
        const createdAt = new Date();
        return new Serial({
            id,
            componentId: input.componentId,
            serialNumber: input.serialNumber.trim(),
            locationId: input.locationId ?? null,
            createdAt,
        });
    }
    static rehydrate(props) {
        return new Serial(props);
    }
}
exports.Serial = Serial;
//# sourceMappingURL=serial.js.map