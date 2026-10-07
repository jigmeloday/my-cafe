"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CARD_COPY, PROFILE_TABS } from "../constant/profile.constant";
import { ContactForm } from "./contact-form";
import { GeneralForm } from "./general-form";
import { HoursForm } from "./hours-form";
import { LocationForm } from "./location-form";
import { MediaSection } from "./media-section";
import { OfferingsForm } from "./offerings-form";
import { SectionCard } from "@/components/business/section-card";
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
        <SectionCard {...CARD_COPY.basics}>
          <GeneralForm />
        </SectionCard>
      </TabsContent>
      <TabsContent value="contact" className="space-y-4">
        <SectionCard {...CARD_COPY.contact}>
          <ContactForm />
        </SectionCard>
        <SectionCard {...CARD_COPY.location}>
          <LocationForm />
        </SectionCard>
        <SectionCard {...CARD_COPY.social}>
          <SocialForm />
        </SectionCard>
      </TabsContent>
      <TabsContent value="hours">
        <SectionCard {...CARD_COPY.hours}>
          <HoursForm />
        </SectionCard>
      </TabsContent>
      <TabsContent value="photos">
        <MediaSection />
      </TabsContent>
      <TabsContent value="offerings">
        <SectionCard {...CARD_COPY.offerings}>
          <OfferingsForm />
        </SectionCard>
      </TabsContent>
    </Tabs>
  );
}
