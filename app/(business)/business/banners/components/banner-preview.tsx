import { HeroSlide } from "@/app/(public)/home/components/hero-slide";

interface BannerPreviewProps {
  businessName: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

/** The banner as it will look on the home page. */
export function BannerPreview({ businessName, title, description, imageUrl }: BannerPreviewProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Preview</p>
      <div className="flex">
        <HeroSlide
          slide={{
            id: "preview",
            eyebrow: businessName,
            title: title || "Your headline",
            description,
            cta: "View offer",
            href: "#",
            sponsored: true,
            imageLabel: "Your banner image",
            imageUrl: imageUrl ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
