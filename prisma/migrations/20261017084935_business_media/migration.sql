-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "coverKey" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "gallery" TEXT[],
ADD COLUMN     "logoKey" TEXT NOT NULL DEFAULT '';
