-- CreateEnum
CREATE TYPE "PromotionEventType" AS ENUM ('VIEW', 'CLICK');

-- CreateTable
CREATE TABLE "PromotionEvent" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "type" "PromotionEventType" NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'other',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromotionEvent_promotionId_createdAt_idx" ON "PromotionEvent"("promotionId", "createdAt");

-- CreateIndex
CREATE INDEX "PromotionEvent_createdAt_idx" ON "PromotionEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "PromotionEvent" ADD CONSTRAINT "PromotionEvent_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
