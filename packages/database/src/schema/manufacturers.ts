import {
  boolean,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const manufacturers = pgTable(
  "manufacturers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    code: varchar("code", { length: 100 }).notNull(),

    name: varchar("name", { length: 200 }).notNull(),

    isActive: boolean("is_active").notNull().default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      codeIdx: uniqueIndex("manufacturers_code_idx").on(table.code),
    };
  },
);

export type Manufacturer = typeof manufacturers.$inferSelect;
export type NewManufacturer = typeof manufacturers.$inferInsert;
