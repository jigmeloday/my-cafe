/*
  Warnings:

  - You are about to drop the column `popularity` on the `Menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "popularity",
ALTER COLUMN "slug" DROP NOT NULL;
