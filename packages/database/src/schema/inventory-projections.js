"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryProjections = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const components_1 = require("./components");
const locations_1 = require("./locations");
exports.inventoryProjections = (0, pg_core_1.pgTable)("inventory_projections", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    componentId: (0, pg_core_1.uuid)("component_id")
        .notNull()
        .references(() => components_1.components.id, {
        onDelete: "cascade",
    }),
    locationId: (0, pg_core_1.uuid)("location_id")
        .notNull()
        .references(() => locations_1.locations.id, {
        onDelete: "cascade",
    }),
    quantity: (0, pg_core_1.integer)("quantity").notNull().default(0),
    unitOfMeasure: (0, pg_core_1.varchar)("unit_of_measure", { length: 50 }).notNull(),
    lastUpdated: (0, pg_core_1.timestamp)("last_updated", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("inventory_projections_comp_loc_unique").on(table.componentId, table.locationId),
    (0, pg_core_1.index)("inventory_projections_component_id_idx").on(table.componentId),
    (0, pg_core_1.index)("inventory_projections_location_id_idx").on(table.locationId),
]);
//# sourceMappingURL=inventory-projections.js.map