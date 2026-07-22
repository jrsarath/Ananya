import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { components } from "./components";
import { locations } from "./locations";

export const inventoryReservations = pgTable(
  "inventory_reservations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    componentId: uuid("component_id")
      .notNull()
      .references(() => components.id, {
        onDelete: "cascade",
      }),

    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id, {
        onDelete: "cascade",
      }),

    quantity: integer("quantity").notNull(),

    unitOfMeasure: varchar("unit_of_measure", { length: 50 }).notNull(),

    reference: varchar("reference", { length: 200 }),

    reservedBy: varchar("reserved_by", { length: 100 }).notNull(),

    status: varchar("status", { length: 50 }).notNull().default("ACTIVE"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    index("inventory_reservations_component_id_idx").on(table.componentId),
    index("inventory_reservations_location_id_idx").on(table.locationId),
    index("inventory_reservations_status_idx").on(table.status),
  ],
);

export type InventoryReservationRow = typeof inventoryReservations.$inferSelect;
export type NewInventoryReservationRow =
  typeof inventoryReservations.$inferInsert;
