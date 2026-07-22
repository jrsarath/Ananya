"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.components = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const locations_1 = require("./locations");
exports.components = (0, pg_core_1.pgTable)("components", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    sku: (0, pg_core_1.varchar)("sku", { length: 100 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 200 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 1000 }),
    manufacturerId: (0, pg_core_1.uuid)("manufacturer_id"),
    categoryId: (0, pg_core_1.uuid)("category_id"),
    defaultLocationId: (0, pg_core_1.uuid)("default_location_id").references(() => locations_1.locations.id, {
        onDelete: "set null",
    }),
    unit: (0, pg_core_1.varchar)("unit", { length: 50 }).notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
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
    (0, pg_core_1.uniqueIndex)("components_sku_unique").on(table.sku),
    (0, pg_core_1.index)("components_manufacturer_id_idx").on(table.manufacturerId),
    (0, pg_core_1.index)("components_category_id_idx").on(table.categoryId),
    (0, pg_core_1.index)("components_default_location_id_idx").on(table.defaultLocationId),
    (0, pg_core_1.index)("components_unit_idx").on(table.unit),
]);
//# sourceMappingURL=components.js.map