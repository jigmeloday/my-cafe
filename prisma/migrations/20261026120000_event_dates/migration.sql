-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN "eventStartsAt" DATE,
ADD COLUMN "eventEndsAt" DATE,
ADD COLUMN "eventStartTime" TEXT NOT NULL DEFAULT '',
ADD COLUMN "eventEndTime" TEXT NOT NULL DEFAULT '';
