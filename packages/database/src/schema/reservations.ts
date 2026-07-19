import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";

export const reservations = pgTable(
  "reservations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    componentId: uuid("component_id").notNull(),

    quantity: numeric("quantity", { precision: 20, scale: 6 }).notNull(),

    unitOfMeasure: varchar("unit_of_measure", { length: 50 }).notNull(),

    locationId: uuid("location_id").notNull(),

    businessReference: varchar("business_reference", { length: 255 }).notNull(),

    reservedBy: varchar("reserved_by", { length: 100 }).notNull(),

    status: varchar("status", { length: 20 }).notNull().default('Created'),

    expiry: timestamp("expiry", { withTimezone: true }),

    notes: varchar("notes", { length: 1000 }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),

    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  },
  (table) => [
    index("reservations_component_id_idx").on(table.componentId),
    index("reservations_location_id_idx").on(table.locationId),
    index("reservations_status_idx").on(table.status),
    index("reservations_business_reference_idx").on(table.businessReference),
    index("reservations_reserved_by_idx").on(table.reservedBy),
  ],
);

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
