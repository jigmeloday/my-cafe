-- CreateEnum
CREATE TYPE "BusinessEventType" AS ENUM ('VIEW', 'CALL', 'EMAIL', 'WEBSITE', 'SOCIAL');

-- AlterTable
ALTER TABLE "PromotionEvent" ADD COLUMN     "visitor" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "BusinessEvent" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" "BusinessEventType" NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'other',
    "visitor" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteVisit" (
    "id" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "visitor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessEvent_businessId_createdAt_idx" ON "BusinessEvent"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "SiteVisit_createdAt_idx" ON "SiteVisit"("createdAt");

-- AddForeignKey
ALTER TABLE "BusinessEvent" ADD CONSTRAINT "BusinessEvent_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

