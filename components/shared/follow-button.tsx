"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type FollowButtonProps = Pick<
  React.ComponentProps<typeof Button>,
  "size" | "className"
> & { initialFollowing?: boolean };

export function FollowButton({
  size,
  className,
  initialFollowing = false,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);

  return (
    <Button
      type="button"
      variant={following ? "soft" : "default"}
      aria-pressed={following}
      onClick={() => setFollowing((v) => !v)}
      size={size}
      className={className}
    >
      {following ? <Check /> : <Plus />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}
