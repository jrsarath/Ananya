import {
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
  date,
} from "drizzle-orm/pg-core";

export const serials = pgTable(
  "serials",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    componentId: uuid("component_id").notNull(),

    serialNumber: varchar("serial_number", { length: 100 }).notNull(),

    unitOfMeasure: varchar("unit_of_measure", { length: 50 }).notNull(),

    locationId: uuid("location_id").notNull(),

    status: varchar("status", { length: 20 }).notNull().default('Created'),

    manufactureDate: date("manufacture_date"),

    receivedBy: varchar("received_by", { length: 100 }).notNull(),

    notes: varchar("notes", { length: 1000 }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    consumedAt: timestamp("consumed_at", { withTimezone: true }),

    consumedBy: varchar("consumed_by", { length: 100 }),

    lostAt: timestamp("lost_at", { withTimezone: true }),

    damagedAt: timestamp("damaged_at", { withTimezone: true }),

    quarantinedAt: timestamp("quarantined_at", { withTimezone: true }),

    quarantinedBy: varchar("quarantined_by", { length: 100 }),

    quarantineReason: varchar("quarantine_reason", { length: 1000 }),
  },
  (table) => [
    index("serials_component_id_idx").on(table.componentId),
    index("serials_location_id_idx").on(table.locationId),
    index("serials_status_idx").on(table.status),
    index("serials_serial_number_idx").on(table.serialNumber),
  ],
);

export type Serial = typeof serials.$inferSelect;
export type NewSerial = typeof serials.$inferInsert;
