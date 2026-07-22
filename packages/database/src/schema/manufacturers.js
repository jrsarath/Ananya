"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manufacturers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.manufacturers = (0, pg_core_1.pgTable)("manufacturers", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    code: (0, pg_core_1.varchar)("code", { length: 100 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 200 }).notNull(),
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
}, (table) => {
    return {
        codeIdx: (0, pg_core_1.uniqueIndex)("manufacturers_code_idx").on(table.code),
    };
});
//# sourceMappingURL=manufacturers.js.map