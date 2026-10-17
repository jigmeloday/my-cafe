"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Toaster, toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { setFavoriteAction, setFollowAction } from "@/server/actions/engagement.actions";

type Kind = "favorite" | "follow";

interface EngagementContextValue {
  /** True once this person's saved lists have loaded (always false for visitors who are signed out). */
  ready: boolean;
  isFavorite: (href: string) => boolean;
  isFollowing: (href: string) => boolean;
  toggleFavorite: (href: string) => void;
  toggleFollow: (href: string) => void;
}

const EngagementContext = createContext<EngagementContextValue | null>(null);

const toggled = (set: Set<string>, href: string, on: boolean) => {
  const next = new Set(set);
  if (on) next.add(href);
  else next.delete(href);
  return next;
};

interface Saved {
  /** Whose lists these are, so a different (or signed-out) user never sees them. */
  userId?: string;
  favorites: Set<string>;
  following: Set<string>;
}

const NOTHING: Saved = { favorites: new Set(), following: new Set() };

/** Knows what the signed-in person has saved and followed, so hearts and Follow buttons start right. */
export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const userId = authClient.useSession().data?.user.id;
  const [loaded, setLoaded] = useState<Saved>(NOTHING);
  const busy = useRef<Set<string>>(new Set());

  const { favorites, following } = userId && loaded.userId === userId ? loaded : NOTHING;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetch("/api/engagement", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { favorites: string[]; following: string[] }) => {
        if (!cancelled) setLoaded({ userId, favorites: new Set(data.favorites), following: new Set(data.following) });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = useCallback(
    async (kind: Kind, href: string) => {
      if (!userId) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      const key = `${kind}:${href}`;
      if (busy.current.has(key)) return;
      busy.current.add(key);

      const field = kind === "favorite" ? "favorites" : "following";
      const was = (kind === "favorite" ? favorites : following).has(href);
      const change = (on: boolean) =>
        setLoaded((prev) => {
          const base = prev.userId === userId ? prev : { userId, favorites: new Set<string>(), following: new Set<string>() };
          return { ...base, [field]: toggled(base[field], href, on) };
        });
      change(!was);

      const result =
        kind === "favorite"
          ? await setFavoriteAction({ href, saved: !was })
          : await setFollowAction({ href, following: !was });

      if (!result.ok) {
        change(was);
        toast.add({ title: result.error });
      }
      busy.current.delete(key);
    },
    [userId, router, pathname, favorites, following]
  );

  const ready = Boolean(userId) && loaded.userId === userId;

  const value = useMemo<EngagementContextValue>(
    () => ({
      ready,
      isFavorite: (href) => favorites.has(href),
      isFollowing: (href) => following.has(href),
      toggleFavorite: (href) => void toggle("favorite", href),
      toggleFollow: (href) => void toggle("follow", href),
    }),
    [ready, favorites, following, toggle]
  );

  return (
    <EngagementContext.Provider value={value}>
      <Toaster>{children}</Toaster>
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (!context) throw new Error("useEngagement must be used inside <EngagementProvider>.");
  return context;
}
