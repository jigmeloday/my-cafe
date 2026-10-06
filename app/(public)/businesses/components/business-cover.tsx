import { ImagePlaceholder } from "@/components/shared/image-placeholder";

export function BusinessCover({ name }: { name: string }) {
  return (
    <div className="relative">
      <ImagePlaceholder
        label="Cover photo"
        className="aspect-[16/6] rounded-2xl sm:aspect-[16/5]"
      />
      <ImagePlaceholder
        label={`${name} logo`}
        className="absolute -bottom-10 left-4 size-20 rounded-full border-4 border-background text-[10px] sm:left-6 sm:size-24"
      />
    </div>
  );
}
