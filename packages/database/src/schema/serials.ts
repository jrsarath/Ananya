import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { components } from "./components";
import { locations } from "./locations";

export const serials = pgTable(
  "serials",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    componentId: uuid("component_id")
      .notNull()
      .references(() => components.id, {
        onDelete: "cascade",
      }),

    serialNumber: varchar("serial_number", { length: 100 }).notNull(),

    locationId: uuid("location_id").references(() => locations.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("serials_component_serial_unique").on(
      table.componentId,
      table.serialNumber,
    ),
    index("serials_component_id_idx").on(table.componentId),
    index("serials_location_id_idx").on(table.locationId),
  ],
);

export type SerialRow = typeof serials.$inferSelect;
export type NewSerialRow = typeof serials.$inferInsert;
