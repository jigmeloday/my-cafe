"use client";

import { Check, Plus } from "lucide-react";

import { useEngagement } from "@/components/engagement/engagement-provider";
import { Button } from "@/components/ui/button";

type FollowButtonProps = Pick<React.ComponentProps<typeof Button>, "size" | "className"> & {
  /** The page address of the business, e.g. "/businesses/restaurant". */
  href: string;
  /** Shown until the real state has loaded, for pages that already know (like your Following list). */
  defaultFollowing?: boolean;
};

export function FollowButton({ href, size, className, defaultFollowing = false }: FollowButtonProps) {
  const { ready, isFollowing, toggleFollow } = useEngagement();
  const following = ready ? isFollowing(href) : defaultFollowing;

  return (
    <Button
      type="button"
      variant={following ? "soft" : "default"}
      aria-pressed={following}
      onClick={() => toggleFollow(href)}
      size={size}
      className={className}
    >
      {following ? <Check /> : <Plus />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
