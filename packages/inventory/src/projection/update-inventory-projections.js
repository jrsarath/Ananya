"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInventoryProjections = void 0;
const calculate_inventory_projection_1 = require("./calculate-inventory-projection");
class UpdateInventoryProjections {
    projectionRepository;
    constructor(projectionRepository) {
        this.projectionRepository = projectionRepository;
    }
    async execute({ transaction, }) {
        const componentId = transaction.componentId;
        // Determine which locations are affected by this transaction
        const affectedLocations = [];
        if (transaction.sourceLocationId) {
            affectedLocations.push(transaction.sourceLocationId);
        }
        if (transaction.destinationLocationId) {
            affectedLocations.push(transaction.destinationLocationId);
        }
        // For each affected location, update the projection
        for (const locationId of affectedLocations) {
            try {
                const projection = calculate_inventory_projection_1.CalculateInventoryProjection.execute({
                    componentId,
                    locationId,
                    transactions: [transaction],
                });
                await this.projectionRepository.save(projection);
            }
            catch (error) {
                console.error(`Failed to update projection for component ${componentId} at location ${locationId}:`, error);
            }
        }
    }
}
exports.UpdateInventoryProjections = UpdateInventoryProjections;
//# sourceMappingURL=update-inventory-projections.js.map