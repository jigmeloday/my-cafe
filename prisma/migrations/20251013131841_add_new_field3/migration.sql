/*
  Warnings:

  - The primary key for the `Banner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Banner` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Menu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `img` on the `Menu` table. All the data in the column will be lost.
  - The `id` column on the `Menu` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Banner_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Cafe" ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "googleMap" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_pkey",
DROP COLUMN "img",
ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "carbs" DOUBLE PRECISION,
ADD COLUMN     "categoryId" UUID NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "fat" DOUBLE PRECISION,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "popularity" INTEGER DEFAULT 0,
ADD COLUMN     "prepTime" INTEGER,
ADD COLUMN     "protein" DOUBLE PRECISION,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "tags" JSONB,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Menu_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuImage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "menuId" UUID NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "MenuImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_slug_key" ON "Menu"("slug");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuImage" ADD CONSTRAINT "MenuImage_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
