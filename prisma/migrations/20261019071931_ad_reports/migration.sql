-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('MISLEADING', 'WRONG_PRICE', 'SCAM', 'SPAM', 'OFFENSIVE', 'CLOSED', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ReportDecision" AS ENUM ('DISMISSED', 'WARNED', 'REMOVED');

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "removedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "removedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "promotionId" TEXT,
    "bannerId" TEXT,
    "reason" "ReportReason" NOT NULL,
    "details" TEXT NOT NULL DEFAULT '',
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "decision" "ReportDecision",
    "resolvedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Report_promotionId_idx" ON "Report"("promotionId");

-- CreateIndex
CREATE INDEX "Report_bannerId_idx" ON "Report"("bannerId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reporterId_promotionId_key" ON "Report"("reporterId", "promotionId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reporterId_bannerId_key" ON "Report"("reporterId", "bannerId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
