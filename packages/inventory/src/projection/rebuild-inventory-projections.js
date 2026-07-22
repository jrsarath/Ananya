"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RebuildInventoryProjections = void 0;
const calculate_inventory_projection_1 = require("./calculate-inventory-projection");
class RebuildInventoryProjections {
    transactionRepository;
    projectionRepository;
    constructor(transactionRepository, projectionRepository) {
        this.transactionRepository = transactionRepository;
        this.projectionRepository = projectionRepository;
    }
    async execute() {
        // Get all transactions
        const transactions = await this.transactionRepository.findMany();
        // Group transactions by component and location
        const componentLocationMap = new Map();
        for (const transaction of transactions) {
            const key = `${transaction.componentId}-${transaction.sourceLocationId || "none"}-${transaction.destinationLocationId || "none"}`;
            if (!componentLocationMap.has(key)) {
                componentLocationMap.set(key, []);
            }
            componentLocationMap.get(key)?.push(transaction);
        }
        // For each unique component/location combination, calculate the projection
        for (const [key, componentTransactions] of componentLocationMap.entries()) {
            const parts = key.split("-");
            const componentId = parts[0] ?? "";
            const sourceLocationId = parts[1] ?? "none";
            const destinationLocationId = parts[2] ?? "none";
            // We'll calculate for both source and destination locations if they exist
            const locationsToCalculate = [];
            if (sourceLocationId !== "none") {
                locationsToCalculate.push(sourceLocationId);
            }
            if (destinationLocationId !== "none") {
                locationsToCalculate.push(destinationLocationId);
            }
            // Remove duplicates
            const uniqueLocations = [...new Set(locationsToCalculate)];
            for (const locationId of uniqueLocations) {
                try {
                    const projection = calculate_inventory_projection_1.CalculateInventoryProjection.execute({
                        componentId,
                        locationId,
                        transactions: componentTransactions,
                    });
                    // Save the projection
                    await this.projectionRepository.save(projection);
                }
                catch (error) {
                    console.error(`Failed to calculate projection for component ${componentId} at location ${locationId}:`, error);
                    // Continue with other projections
                }
            }
        }
    }
}
exports.RebuildInventoryProjections = RebuildInventoryProjections;
//# sourceMappingURL=rebuild-inventory-projections.js.map