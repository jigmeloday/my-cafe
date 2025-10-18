/*
  Warnings:

  - The `status` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,reviewableType,reviewableId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `likeableType` on the `Like` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `likeableId` on the `Like` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reviewableType` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reviewableId` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReviewableType" AS ENUM ('Cafe', 'Menu');

-- CreateEnum
CREATE TYPE "LikeableType" AS ENUM ('Blog', 'Cafe', 'Menu');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('draft', 'published', 'archived');

-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_cafeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Banner" DROP CONSTRAINT "Banner_cafeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Banner" DROP CONSTRAINT "Banner_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Blog" DROP CONSTRAINT "Blog_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Blog" DROP CONSTRAINT "Blog_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cafe" DROP CONSTRAINT "Cafe_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_hostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EventAttendee" DROP CONSTRAINT "EventAttendee_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EventAttendee" DROP CONSTRAINT "EventAttendee_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Menu" DROP CONSTRAINT "Menu_cafeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Menu" DROP CONSTRAINT "Menu_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MenuImage" DROP CONSTRAINT "MenuImage_menuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "status",
ADD COLUMN     "status" "BlogStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "likeableType",
ADD COLUMN     "likeableType" "LikeableType" NOT NULL,
DROP COLUMN "likeableId",
ADD COLUMN     "likeableId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "reviewableType",
ADD COLUMN     "reviewableType" "ReviewableType" NOT NULL,
DROP COLUMN "reviewableId",
ADD COLUMN     "reviewableId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Like_likeableType_likeableId_idx" ON "Like"("likeableType", "likeableId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_likeableType_likeableId_key" ON "Like"("userId", "likeableType", "likeableId");

-- CreateIndex
CREATE INDEX "Review_reviewableType_reviewableId_idx" ON "Review"("reviewableType", "reviewableId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_reviewableType_reviewableId_key" ON "Review"("userId", "reviewableType", "reviewableId");

-- AddForeignKey
ALTER TABLE "Cafe" ADD CONSTRAINT "Cafe_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuImage" ADD CONSTRAINT "MenuImage_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Cafe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
