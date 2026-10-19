import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { FollowButton } from "@/components/shared/follow-button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { PROFILE_COPY } from "../constant/profile.constant";
import type { FollowedPlace } from "../model/profile.type";

export function FollowingList({ places, limit }: { places: FollowedPlace[]; limit?: number }) {
  const shown = places.slice(0, limit);
  if (shown.length === 0) {
    return <EmptyState title={PROFILE_COPY.followingEmptyTitle} description={PROFILE_COPY.followingEmptyDescription} />;
  }

  return (
    <ul className="grid gap-x-8 sm:grid-cols-2">
      {shown.map((place) => (
        <li key={place.href} className="flex items-center gap-4 border-b py-4">
          {place.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={place.imageUrl} alt="" className="size-14 shrink-0 rounded-full bg-muted object-cover" />
          ) : (
            <ImagePlaceholder label="Logo" className="size-14 shrink-0 rounded-full" />
          )}
          <Link href={place.href} className="min-w-0 flex-1">
            <p className="truncate font-semibold">{place.title}</p>
            <p className="truncate text-sm text-muted-foreground">{place.subtitle}</p>
          </Link>
          <FollowButton href={place.href} defaultFollowing size="sm" />
        </li>
      ))}
    </ul>
  );
}
