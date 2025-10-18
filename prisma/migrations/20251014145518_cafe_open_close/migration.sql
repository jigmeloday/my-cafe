/*
  Warnings:

  - Changed the type of `openTime` on the `Cafe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `closeTime` on the `Cafe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Cafe" DROP COLUMN "openTime",
ADD COLUMN     "openTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "closeTime",
ADD COLUMN     "closeTime" TIMESTAMP(3) NOT NULL;
