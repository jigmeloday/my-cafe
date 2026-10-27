-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELED');

-- CreateTable
CREATE TABLE "CoinPurchase" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "coins" INTEGER NOT NULL,
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BTN',
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "providerRef" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "CoinPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoinPurchase_businessId_createdAt_idx" ON "CoinPurchase"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "CoinPurchase_status_createdAt_idx" ON "CoinPurchase"("status", "createdAt");

-- CreateIndex
CREATE INDEX "CoinPurchase_providerRef_idx" ON "CoinPurchase"("providerRef");

-- CreateTable
CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL DEFAULT '',
    "summary" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentEvent_receivedAt_idx" ON "PaymentEvent"("receivedAt");

-- AddForeignKey
ALTER TABLE "CoinPurchase" ADD CONSTRAINT "CoinPurchase_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
