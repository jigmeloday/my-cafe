-- CreateEnum
CREATE TYPE "BannerReview" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN "review" "BannerReview" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN "reviewNote" TEXT NOT NULL DEFAULT '',
ADD COLUMN "reviewedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Banner_review_idx" ON "Banner"("review");
