"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batches = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const components_1 = require("./components");
exports.batches = (0, pg_core_1.pgTable)("batches", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    componentId: (0, pg_core_1.uuid)("component_id")
        .notNull()
        .references(() => components_1.components.id, {
        onDelete: "cascade",
    }),
    batchNumber: (0, pg_core_1.varchar)("batch_number", { length: 100 }).notNull(),
    manufacturingDate: (0, pg_core_1.timestamp)("manufacturing_date", {
        withTimezone: true,
    }),
    expiryDate: (0, pg_core_1.timestamp)("expiry_date", {
        withTimezone: true,
    }),
    supplierBatchNumber: (0, pg_core_1.varchar)("supplier_batch_number", { length: 100 }),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("batches_component_batch_unique").on(table.componentId, table.batchNumber),
    (0, pg_core_1.index)("batches_component_id_idx").on(table.componentId),
]);
//# sourceMappingURL=batches.js.map