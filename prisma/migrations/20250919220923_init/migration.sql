-- CreateTable
CREATE TABLE "public"."services" (
    "slug" VARCHAR(36) NOT NULL,
    "service_name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "slug" VARCHAR(36) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "username" VARCHAR(32),
    "password" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "service_slug" VARCHAR(36),

    CONSTRAINT "users_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_email_and_username_service" ON "public"."users"("username", "email", "service_slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_email_service" ON "public"."users"("email", "service_slug");

-- CreateIndex
CREATE UNIQUE INDEX "unique_username_service" ON "public"."users"("username", "service_slug");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "fk_service_slug" FOREIGN KEY ("service_slug") REFERENCES "public"."services"("slug") ON DELETE CASCADE ON UPDATE NO ACTION;
