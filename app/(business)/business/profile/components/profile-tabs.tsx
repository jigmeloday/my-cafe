"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CARD_COPY, PROFILE_TABS } from "../constant/profile.constant";
import { ContactForm } from "./contact-form";
import { GeneralForm } from "./general-form";
import { HoursForm } from "./hours-form";
import { LocationForm } from "./location-form";
import { MediaSection } from "./media-section";
import { OfferingsForm } from "./offerings-form";
import { ProfileCard } from "./profile-card";
import { SocialForm } from "./social-form";

export function ProfileTabs() {
  return (
    <Tabs defaultValue={PROFILE_TABS[0].id}>
      <TabsList>
        {PROFILE_TABS.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="general">
        <ProfileCard {...CARD_COPY.basics}>
          <GeneralForm />
        </ProfileCard>
      </TabsContent>
      <TabsContent value="contact" className="space-y-4">
        <ProfileCard {...CARD_COPY.contact}>
          <ContactForm />
        </ProfileCard>
        <ProfileCard {...CARD_COPY.location}>
          <LocationForm />
        </ProfileCard>
        <ProfileCard {...CARD_COPY.social}>
          <SocialForm />
        </ProfileCard>
      </TabsContent>
      <TabsContent value="hours">
        <ProfileCard {...CARD_COPY.hours}>
          <HoursForm />
        </ProfileCard>
      </TabsContent>
      <TabsContent value="photos">
        <MediaSection />
      </TabsContent>
      <TabsContent value="offerings">
        <ProfileCard {...CARD_COPY.offerings}>
          <OfferingsForm />
        </ProfileCard>
      </TabsContent>
    </Tabs>
  );
}
