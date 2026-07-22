"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.units = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.units = (0, pg_core_1.pgTable)("units", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 50 }).notNull(),
    isBaseUnit: (0, pg_core_1.boolean)("is_base_unit").notNull().default(false),
    conversionFactor: (0, pg_core_1.numeric)("conversion_factor", { precision: 10, scale: 4 }),
    precision: (0, pg_core_1.numeric)("precision", { precision: 10, scale: 0 })
        .notNull()
        .default("0"),
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
    (0, pg_core_1.uniqueIndex)("units_name_unique").on(table.name),
    (0, pg_core_1.index)("units_category_idx").on(table.category),
    (0, pg_core_1.index)("units_is_base_unit_idx").on(table.isBaseUnit),
]);
//# sourceMappingURL=units.js.map