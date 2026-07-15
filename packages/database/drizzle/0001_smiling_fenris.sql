CREATE TABLE "components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sku" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" varchar(1000),
	"manufacturer_id" uuid,
	"category_id" uuid,
	"default_location_id" uuid,
	"unit" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "components" ADD CONSTRAINT "components_default_location_id_locations_id_fk" FOREIGN KEY ("default_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "components_sku_unique" ON "components" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "components_manufacturer_id_idx" ON "components" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "components_category_id_idx" ON "components" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "components_default_location_id_idx" ON "components" USING btree ("default_location_id");--> statement-breakpoint
CREATE INDEX "components_unit_idx" ON "components" USING btree ("unit");