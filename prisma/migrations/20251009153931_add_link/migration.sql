/*
  Warnings:

  - Added the required column `link` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "link" TEXT NOT NULL;
