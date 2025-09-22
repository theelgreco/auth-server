-- Step 1: Create the ENUM type
CREATE TYPE "public"."ServiceName" AS ENUM ('ftp', 'income_calculator');

-- Step 2: Drop the foreign key temporarily
ALTER TABLE "public"."users" DROP CONSTRAINT "fk_service_slug";

-- Step 3: Alter the column to the ENUM type safely
ALTER TABLE "public"."services"
ALTER COLUMN "service_name" TYPE "public"."ServiceName"
USING "service_name"::text::"public"."ServiceName";

-- Step 4: Recreate the unique index
CREATE UNIQUE INDEX IF NOT EXISTS "services_service_name_key" ON "public"."services"("service_name");

-- Step 5: Add the foreign key back
ALTER TABLE "public"."users" ADD CONSTRAINT "fk_service_slug" 
FOREIGN KEY ("service_slug") REFERENCES "public"."services"("slug") 
ON DELETE SET NULL ON UPDATE CASCADE;