/** The business's photos for a promotion: one big photo, or a mosaic when there are several. */
export function DetailGallery({ photos }: { photos: string[] }) {
  const [first, ...others] = photos;
  const several = photos.length > 1;

  return (
    <div className={several ? "grid gap-2 overflow-hidden rounded-3xl md:h-[26rem] md:grid-cols-4 md:grid-rows-2" : "overflow-hidden rounded-3xl"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={first} alt="" className={several ? "aspect-4/3 size-full bg-muted object-cover md:col-span-2 md:row-span-2 md:aspect-auto" : "max-h-[26rem] w-full bg-muted object-cover"} />
      {others.slice(0, 4).map((url) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={url} src={url} alt="" loading="lazy" className="hidden size-full bg-muted object-cover md:block" />
      ))}
    </div>
  );
}
