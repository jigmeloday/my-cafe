-- CreateTable
CREATE TABLE "Profile" (
    "userId" TEXT NOT NULL,
    "birthday" DATE,
    "gender" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "preferredContact" TEXT NOT NULL DEFAULT 'email',
    "addressLine1" TEXT NOT NULL DEFAULT '',
    "addressLine2" TEXT NOT NULL DEFAULT '',
    "town" TEXT NOT NULL DEFAULT '',
    "dzongkhag" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "interests" TEXT[],
    "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifySms" BOOLEAN NOT NULL DEFAULT false,
    "notifyPush" BOOLEAN NOT NULL DEFAULT true,
    "topicFollowed" BOOLEAN NOT NULL DEFAULT true,
    "topicWeekend" BOOLEAN NOT NULL DEFAULT true,
    "topicNewPlaces" BOOLEAN NOT NULL DEFAULT false,
    "topicEnding" BOOLEAN NOT NULL DEFAULT true,
    "topicBirthday" BOOLEAN NOT NULL DEFAULT true,
    "allowPersonalisation" BOOLEAN NOT NULL DEFAULT true,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "marketingConsentAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
