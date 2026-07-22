"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryReservations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const components_1 = require("./components");
const locations_1 = require("./locations");
exports.inventoryReservations = (0, pg_core_1.pgTable)("inventory_reservations", {
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
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    unitOfMeasure: (0, pg_core_1.varchar)("unit_of_measure", { length: 50 }).notNull(),
    reference: (0, pg_core_1.varchar)("reference", { length: 200 }),
    reservedBy: (0, pg_core_1.varchar)("reserved_by", { length: 100 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("ACTIVE"),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at", {
        withTimezone: true,
    }),
}, (table) => [
    (0, pg_core_1.index)("inventory_reservations_component_id_idx").on(table.componentId),
    (0, pg_core_1.index)("inventory_reservations_location_id_idx").on(table.locationId),
    (0, pg_core_1.index)("inventory_reservations_status_idx").on(table.status),
]);
//# sourceMappingURL=inventory-reservations.js.map