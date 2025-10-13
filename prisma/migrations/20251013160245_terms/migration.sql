-- AlterTable
ALTER TABLE "Cafe" ADD COLUMN     "aggreeTerms" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cafeCreation" BOOLEAN DEFAULT false;
