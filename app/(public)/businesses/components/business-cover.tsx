import { ImagePlaceholder } from "@/components/shared/image-placeholder";

interface BusinessCoverProps {
  name: string;
  coverUrl?: string;
  logoUrl?: string;
}

const LOGO_CLASS =
  "absolute -bottom-10 left-4 size-20 rounded-full border-4 border-background sm:left-6 sm:size-24";

export function BusinessCover({ name, coverUrl, logoUrl }: BusinessCoverProps) {
  return (
    <div className="relative">
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverUrl} alt="" className="aspect-[16/6] w-full rounded-2xl object-cover sm:aspect-[16/5]" />
      ) : (
        <ImagePlaceholder label="Cover photo" className="aspect-[16/6] rounded-2xl sm:aspect-[16/5]" />
      )}
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={`${name} logo`} className={`${LOGO_CLASS} bg-surface object-cover`} />
      ) : (
        <ImagePlaceholder label={`${name} logo`} className={`${LOGO_CLASS} text-[10px]`} />
      )}
    </div>
  );
}
