"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Download, Share2, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { shareLinks, storyImageHref, type ShareKind } from "@/lib/share";
import { trackBusiness, trackEvent } from "@/lib/track-client";

interface ShareButtonProps {
  /** The page's address on this site, e.g. "/promotions/pizza-fridays". */
  path: string;
  title: string;
  /** Picks the story picture to offer for Instagram, TikTok and Facebook stories. */
  story?: { kind: ShareKind; slug: string };
  /** Counts a share for the business. Give `promotionId` for a promotion, or `businessSlug` for a business page. Leave out for sample pages. */
  track?: { promotionId?: string; businessSlug?: string };
  className?: string;
}

const OPTION = "justify-start";

/** The address and what the browser can do never change while the page is open, so there is nothing to subscribe to. */
const NEVER_CHANGES = () => () => {};

/** Opens a small sheet to share a page: copy the link, post to other apps, or save a story picture. */
export function ShareButton({ path, title, story, track, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Known only in the browser, so the server render never touches `window` or `navigator`.
  const origin = useSyncExternalStore(NEVER_CHANGES, () => window.location.origin, () => "");
  const canShareNatively = useSyncExternalStore(NEVER_CHANGES, () => typeof navigator.share === "function", () => false);

  const url = `${origin}${path}`;
  const counted = () => {
    if (track?.promotionId) trackEvent(track.promotionId, "SHARE");
    else if (track?.businessSlug) trackBusiness(track.businessSlug, "SHARE");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      counted();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copying can be blocked; the other options still work.
    }
  };

  const shareNatively = () => navigator.share({ title, url }).then(() => {
      counted();
      setOpen(false);
    }).catch(() => {});

  return (
    <>
      <Button variant="ghost" size="sm" className={className} onClick={() => setOpen(true)}>
        <Share2 /> Share
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
            <DialogDescription>{title}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {canShareNatively && (
              <Button variant="default" className={OPTION} onClick={shareNatively}>
                <Smartphone /> Share with your apps
              </Button>
            )}
            <Button variant="outline" className={OPTION} onClick={copy}>
              {copied ? <Check /> : <Copy />} {copied ? "Link copied" : "Copy link"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              {shareLinks(url, title).map(({ id, label, href }) => (
                <Button key={id} variant="outline" className={OPTION} nativeButton={false} render={<a href={href} target="_blank" rel="noopener noreferrer" onClick={counted} />}>
                  {label}
                </Button>
              ))}
            </div>
            {story && (
              <div className="space-y-1.5 border-t pt-3">
                <Button variant="secondary" className={`${OPTION} w-full`} nativeButton={false} render={<a href={storyImageHref(story.kind, story.slug)} download onClick={counted} />}>
                  <Download /> Save story picture
                </Button>
                <p className="text-xs text-muted-foreground">For Instagram, TikTok and Facebook stories: save the picture, then add it to your story.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
