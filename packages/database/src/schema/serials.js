"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serials = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const components_1 = require("./components");
const locations_1 = require("./locations");
exports.serials = (0, pg_core_1.pgTable)("serials", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    componentId: (0, pg_core_1.uuid)("component_id")
        .notNull()
        .references(() => components_1.components.id, {
        onDelete: "cascade",
    }),
    serialNumber: (0, pg_core_1.varchar)("serial_number", { length: 100 }).notNull(),
    locationId: (0, pg_core_1.uuid)("location_id").references(() => locations_1.locations.id, {
        onDelete: "set null",
    }),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("serials_component_serial_unique").on(table.componentId, table.serialNumber),
    (0, pg_core_1.index)("serials_component_id_idx").on(table.componentId),
    (0, pg_core_1.index)("serials_location_id_idx").on(table.locationId),
]);
//# sourceMappingURL=serials.js.map