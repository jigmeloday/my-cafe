"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type FollowButtonProps = Pick<
  React.ComponentProps<typeof Button>,
  "size" | "className"
>;

export function FollowButton({ size, className }: FollowButtonProps) {
  const [following, setFollowing] = useState(false);

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
