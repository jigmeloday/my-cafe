-- CreateEnum
CREATE TYPE "OrderMode" AS ENUM ('NONE', 'NOOK', 'WHATSAPP', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PLACED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "orderLabel" TEXT NOT NULL DEFAULT 'Order now',
ADD COLUMN     "orderMode" "OrderMode" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "orderUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "price" INTEGER;

-- CreateTable
CREATE TABLE "ProductOrder" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT NOT NULL DEFAULT '',
    "unitPrice" INTEGER,
    "status" "OrderStatus" NOT NULL DEFAULT 'PLACED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductOrder_promotionId_status_idx" ON "ProductOrder"("promotionId", "status");

-- CreateIndex
CREATE INDEX "ProductOrder_userId_createdAt_idx" ON "ProductOrder"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOrder" ADD CONSTRAINT "ProductOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
