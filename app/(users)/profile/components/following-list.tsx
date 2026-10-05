import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { FollowButton } from "@/components/shared/follow-button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { PROFILE_COPY } from "../constant/profile.constant";
import { FOLLOWING_PLACES } from "../constant/profile.data";

export function FollowingList({ limit }: { limit?: number }) {
  const places = FOLLOWING_PLACES.slice(0, limit);
  if (places.length === 0) {
    return (
      <EmptyState
        title={PROFILE_COPY.followingEmptyTitle}
        description={PROFILE_COPY.followingEmptyDescription}
      />
    );
  }

  return (
    <ul className="grid gap-x-8 sm:grid-cols-2">
      {places.map((place) => (
        <li key={place.id} className="flex items-center gap-4 border-b py-4">
          <ImagePlaceholder
            label="Logo"
            className="size-14 shrink-0 rounded-full"
          />
          <Link href={place.href} className="min-w-0 flex-1">
            <p className="truncate font-semibold">{place.title}</p>
            <p className="truncate text-sm text-muted-foreground">
              {place.meta[0]}
            </p>
          </Link>
          <FollowButton size="sm" initialFollowing />
        </li>
      ))}
    </ul>
  );
}
