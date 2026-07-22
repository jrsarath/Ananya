CREATE TABLE "manufacturers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"component_id" uuid NOT NULL,
	"transaction_type" varchar(50) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_of_measure" varchar(50) NOT NULL,
	"source_location_id" uuid,
	"destination_location_id" uuid,
	"reference" varchar(200),
	"reason" varchar(1000),
	"created_by" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" varchar(50) NOT NULL,
	"is_base_unit" boolean DEFAULT false NOT NULL,
	"conversion_factor" numeric(10, 4),
	"precision" numeric(10, 0) DEFAULT '0' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_projections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"component_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"unit_of_measure" varchar(50) NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"component_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_of_measure" varchar(50) NOT NULL,
	"reference" varchar(200),
	"reserved_by" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"component_id" uuid NOT NULL,
	"batch_number" varchar(100) NOT NULL,
	"manufacturing_date" timestamp with time zone,
	"expiry_date" timestamp with time zone,
	"supplier_batch_number" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "serials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"component_id" uuid NOT NULL,
	"serial_number" varchar(100) NOT NULL,
	"location_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "components" DROP CONSTRAINT IF EXISTS "components_manufacturer_id_components_id_fk";
--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_source_location_id_locations_id_fk" FOREIGN KEY ("source_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_destination_location_id_locations_id_fk" FOREIGN KEY ("destination_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_projections" ADD CONSTRAINT "inventory_projections_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_projections" ADD CONSTRAINT "inventory_projections_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serials" ADD CONSTRAINT "serials_component_id_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."components"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serials" ADD CONSTRAINT "serials_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "manufacturers_code_idx" ON "manufacturers" USING btree ("code");--> statement-breakpoint
CREATE INDEX "inventory_transactions_component_id_idx" ON "inventory_transactions" USING btree ("component_id");--> statement-breakpoint
CREATE INDEX "inventory_transactions_source_location_id_idx" ON "inventory_transactions" USING btree ("source_location_id");--> statement-breakpoint
CREATE INDEX "inventory_transactions_destination_location_id_idx" ON "inventory_transactions" USING btree ("destination_location_id");--> statement-breakpoint
CREATE INDEX "inventory_transactions_transaction_type_idx" ON "inventory_transactions" USING btree ("transaction_type");--> statement-breakpoint
CREATE INDEX "inventory_transactions_created_at_idx" ON "inventory_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "units_name_unique" ON "units" USING btree ("name");--> statement-breakpoint
CREATE INDEX "units_category_idx" ON "units" USING btree ("category");--> statement-breakpoint
CREATE INDEX "units_is_base_unit_idx" ON "units" USING btree ("is_base_unit");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_projections_comp_loc_unique" ON "inventory_projections" USING btree ("component_id","location_id");--> statement-breakpoint
CREATE INDEX "inventory_projections_component_id_idx" ON "inventory_projections" USING btree ("component_id");--> statement-breakpoint
CREATE INDEX "inventory_projections_location_id_idx" ON "inventory_projections" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "inventory_reservations_component_id_idx" ON "inventory_reservations" USING btree ("component_id");--> statement-breakpoint
CREATE INDEX "inventory_reservations_location_id_idx" ON "inventory_reservations" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "inventory_reservations_status_idx" ON "inventory_reservations" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "batches_component_batch_unique" ON "batches" USING btree ("component_id","batch_number");--> statement-breakpoint
CREATE INDEX "batches_component_id_idx" ON "batches" USING btree ("component_id");--> statement-breakpoint
CREATE UNIQUE INDEX "serials_component_serial_unique" ON "serials" USING btree ("component_id","serial_number");--> statement-breakpoint
CREATE INDEX "serials_component_id_idx" ON "serials" USING btree ("component_id");--> statement-breakpoint
CREATE INDEX "serials_location_id_idx" ON "serials" USING btree ("location_id");