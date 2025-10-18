/*
  Warnings:

  - Added the required column `buttonText` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "buttonText" TEXT NOT NULL;
