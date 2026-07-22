"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.locations = (0, pg_core_1.pgTable)("locations", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    code: (0, pg_core_1.varchar)("code", { length: 100 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 200 }).notNull(),
    kind: (0, pg_core_1.varchar)("kind", { length: 50 }).notNull(),
    parentId: (0, pg_core_1.uuid)("parent_id").references(() => exports.locations.id, {
        onDelete: "restrict",
    }),
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
    metadata: (0, pg_core_1.jsonb)("metadata")
        .$type()
        .notNull()
        .default({}),
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
    (0, pg_core_1.uniqueIndex)("locations_code_unique").on(table.code),
    (0, pg_core_1.index)("locations_parent_id_idx").on(table.parentId),
    (0, pg_core_1.index)("locations_kind_idx").on(table.kind),
]);
//# sourceMappingURL=locations.js.map