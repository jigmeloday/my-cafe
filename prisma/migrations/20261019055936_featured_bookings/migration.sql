-- AlterEnum
ALTER TYPE "CoinTransactionType" ADD VALUE 'FEATURED';

-- CreateTable
CREATE TABLE "FeaturedBooking" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "startsAt" DATE NOT NULL,
    "endsAt" DATE NOT NULL,
    "coins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeaturedBooking_startsAt_endsAt_idx" ON "FeaturedBooking"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "FeaturedBooking_promotionId_idx" ON "FeaturedBooking"("promotionId");

-- CreateIndex
CREATE INDEX "FeaturedBooking_businessId_idx" ON "FeaturedBooking"("businessId");

-- AddForeignKey
ALTER TABLE "FeaturedBooking" ADD CONSTRAINT "FeaturedBooking_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedBooking" ADD CONSTRAINT "FeaturedBooking_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
