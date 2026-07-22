import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { components } from "./components";
import { locations } from "./locations";

export const inventoryProjections = pgTable(
  "inventory_projections",
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

    quantity: integer("quantity").notNull().default(0),

    unitOfMeasure: varchar("unit_of_measure", { length: 50 }).notNull(),

    lastUpdated: timestamp("last_updated", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("inventory_projections_comp_loc_unique").on(
      table.componentId,
      table.locationId,
    ),
    index("inventory_projections_component_id_idx").on(table.componentId),
    index("inventory_projections_location_id_idx").on(table.locationId),
  ],
);

export type InventoryProjectionRow = typeof inventoryProjections.$inferSelect;
export type NewInventoryProjectionRow =
  typeof inventoryProjections.$inferInsert;
