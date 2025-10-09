-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "cafeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "spicyRate" INTEGER,
    "ingredients" TEXT,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
