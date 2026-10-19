-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "promotionId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "imageKey" TEXT NOT NULL,
    "startsAt" DATE NOT NULL,
    "endsAt" DATE NOT NULL,
    "coins" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerEvent" (
    "id" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "type" "PromotionEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Banner_businessId_idx" ON "Banner"("businessId");

-- CreateIndex
CREATE INDEX "Banner_startsAt_endsAt_idx" ON "Banner"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "BannerEvent_bannerId_createdAt_idx" ON "BannerEvent"("bannerId", "createdAt");

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerEvent" ADD CONSTRAINT "BannerEvent_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
