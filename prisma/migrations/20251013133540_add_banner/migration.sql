/*
  Warnings:

  - Added the required column `creatorId` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "creatorId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
