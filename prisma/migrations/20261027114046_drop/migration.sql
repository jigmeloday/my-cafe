/*
  Warnings:

  - You are about to drop the `CoinPurchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CoinPurchase" DROP CONSTRAINT "CoinPurchase_businessId_fkey";

-- DropTable
DROP TABLE "CoinPurchase";

-- DropTable
DROP TABLE "PaymentEvent";

-- DropEnum
DROP TYPE "PurchaseStatus";
