import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
  numeric,
  date,
} from "drizzle-orm/pg-core";

export const batches = pgTable(
  "batches",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    componentId: uuid("component_id").notNull(),

    batchNumber: varchar("batch_number", { length: 100 }).notNull(),

    quantity: numeric("quantity", { precision: 20, scale: 6 }).notNull(),

    consumedQuantity: numeric("consumed_quantity", { precision: 20, scale: 6 }).notNull().default('0'),

    unitOfMeasure: varchar("unit_of_measure", { length: 50 }).notNull(),

    locationId: uuid("location_id").notNull(),

    status: varchar("status", { length: 20 }).notNull().default('Created'),

    manufactureDate: date("manufacture_date"),

    expiryDate: date("expiry_date"),

    supplierReference: varchar("supplier_reference", { length: 255 }),

    receivedBy: varchar("received_by", { length: 100 }).notNull(),

    notes: varchar("notes", { length: 1000 }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    fullyConsumedAt: timestamp("fully_consumed_at", { withTimezone: true }),

    expiredAt: timestamp("expired_at", { withTimezone: true }),

    quarantinedAt: timestamp("quarantined_at", { withTimezone: true }),

    quarantinedBy: varchar("quarantined_by", { length: 100 }),

    quarantineReason: varchar("quarantine_reason", { length: 1000 }),
  },
  (table) => [
    index("batches_component_id_idx").on(table.componentId),
    index("batches_location_id_idx").on(table.locationId),
    index("batches_status_idx").on(table.status),
    index("batches_batch_number_idx").on(table.batchNumber),
    index("batches_supplier_reference_idx").on(table.supplierReference),
    index("batches_expiry_date_idx").on(table.expiryDate),
  ],
);

export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;
