-- AlterTable
ALTER TABLE "CoinTransaction" ADD COLUMN     "reference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CoinTransaction_reference_key" ON "CoinTransaction"("reference");
