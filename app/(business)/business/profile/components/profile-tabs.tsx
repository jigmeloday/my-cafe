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
import type { BusinessMedia } from "@/services/business/business.service";
import type { BusinessProfileData } from "@/types/business-profile";

export function ProfileTabs({ data, media }: { data: BusinessProfileData; media: BusinessMedia }) {
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
          <GeneralForm data={data.general} />
        </SectionCard>
      </TabsContent>
      <TabsContent value="contact" className="space-y-4">
        <SectionCard {...CARD_COPY.contact}>
          <ContactForm data={data.contact} />
        </SectionCard>
        <SectionCard {...CARD_COPY.location}>
          <LocationForm data={data.location} />
        </SectionCard>
        <SectionCard {...CARD_COPY.social}>
          <SocialForm data={data.social} />
        </SectionCard>
      </TabsContent>
      <TabsContent value="hours">
        <SectionCard {...CARD_COPY.hours}>
          <HoursForm data={data.hours} />
        </SectionCard>
      </TabsContent>
      <TabsContent value="photos">
        <MediaSection media={media} />
      </TabsContent>
      <TabsContent value="offerings">
        <SectionCard {...CARD_COPY.offerings}>
          <OfferingsForm data={data.offerings} />
        </SectionCard>
      </TabsContent>
    </Tabs>
  );
}
