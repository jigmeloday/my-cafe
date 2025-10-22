/*
  Warnings:

  - You are about to drop the column `aggreeTerms` on the `Cafe` table. All the data in the column will be lost.
  - Made the column `subTitle` on table `Cafe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Cafe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Cafe` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cafe" DROP COLUMN "aggreeTerms",
ADD COLUMN     "agreeTerms" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "subTitle" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;
