import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { components } from "./components";

export const batches = pgTable(
  "batches",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    componentId: uuid("component_id")
      .notNull()
      .references(() => components.id, {
        onDelete: "cascade",
      }),

    batchNumber: varchar("batch_number", { length: 100 }).notNull(),

    manufacturingDate: timestamp("manufacturing_date", {
      withTimezone: true,
    }),

    expiryDate: timestamp("expiry_date", {
      withTimezone: true,
    }),

    supplierBatchNumber: varchar("supplier_batch_number", { length: 100 }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("batches_component_batch_unique").on(
      table.componentId,
      table.batchNumber,
    ),
    index("batches_component_id_idx").on(table.componentId),
  ],
);

export type BatchRow = typeof batches.$inferSelect;
export type NewBatchRow = typeof batches.$inferInsert;
