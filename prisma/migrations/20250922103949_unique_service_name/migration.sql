/*
  Warnings:

  - A unique constraint covering the columns `[service_name]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "services_service_name_key" ON "public"."services"("service_name");
