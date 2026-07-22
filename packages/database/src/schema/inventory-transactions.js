"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryTransactions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const components_1 = require("./components");
const locations_1 = require("./locations");
exports.inventoryTransactions = (0, pg_core_1.pgTable)("inventory_transactions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    componentId: (0, pg_core_1.uuid)("component_id")
        .notNull()
        .references(() => components_1.components.id, {
        onDelete: "cascade",
    }),
    transactionType: (0, pg_core_1.varchar)("transaction_type", { length: 50 }).notNull(),
    quantity: (0, pg_core_1.integer)("quantity").notNull(),
    unitOfMeasure: (0, pg_core_1.varchar)("unit_of_measure", { length: 50 }).notNull(),
    sourceLocationId: (0, pg_core_1.uuid)("source_location_id").references(() => locations_1.locations.id, {
        onDelete: "set null",
    }),
    destinationLocationId: (0, pg_core_1.uuid)("destination_location_id").references(() => locations_1.locations.id, {
        onDelete: "set null",
    }),
    reference: (0, pg_core_1.varchar)("reference", { length: 200 }),
    reason: (0, pg_core_1.varchar)("reason", { length: 1000 }),
    createdBy: (0, pg_core_1.varchar)("created_by", { length: 100 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
}, (table) => [
    (0, pg_core_1.index)("inventory_transactions_component_id_idx").on(table.componentId),
    (0, pg_core_1.index)("inventory_transactions_source_location_id_idx").on(table.sourceLocationId),
    (0, pg_core_1.index)("inventory_transactions_destination_location_id_idx").on(table.destinationLocationId),
    (0, pg_core_1.index)("inventory_transactions_transaction_type_idx").on(table.transactionType),
    (0, pg_core_1.index)("inventory_transactions_created_at_idx").on(table.createdAt),
]);
//# sourceMappingURL=inventory-transactions.js.map