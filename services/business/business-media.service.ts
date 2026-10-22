import { randomBytes } from "node:crypto";

import { keyBelongsTo, MAX_GALLERY, type MediaKind } from "@/lib/media";
import { storage } from "@/lib/storage";
import { businessRepository } from "@/server/repositories/business.repository";
import { mediaRepository } from "@/server/repositories/media.repository";

import { businessService, type Owner } from "./business.service";

type Result = { ok: true } | { ok: false; error: string };
type Image = { ext: string; mime: string };

/** Logo, cover and gallery photos. Files live in the bucket; the business row keeps only their keys. */
export const businessMediaService = {
  async add(owner: Owner, kind: MediaKind, bytes: Uint8Array, image: Image): Promise<({ ok: true; key: string }) | { ok: false; error: string }> {
    const business = await businessService.ensure(owner);
    if (kind === "gallery" && business.gallery.length >= MAX_GALLERY) {
      return { ok: false, error: `You can add up to ${MAX_GALLERY} photos.` };
    }

    // A fresh name every time, so a replaced image never shows from an old cache.
    const key = `business/${business.id}/${kind}-${randomBytes(8).toString("hex")}.${image.ext}`;
    await storage.put(key, bytes, image.mime);

    // Promotion photos and banner images are only files here. The promotion or banner keeps the key when it is saved.
    if (kind === "promotion" || kind === "banner") return { ok: true, key };
    if (kind === "gallery") await businessRepository.update(business.id, owner.id, { gallery: { push: key } });
    else await businessRepository.update(business.id, owner.id, kind === "logo" ? { logoKey: key } : { coverKey: key });

    const old = kind === "logo" ? business.logoKey : kind === "cover" ? business.coverKey : "";
    if (old) await storage.remove(old);
    return { ok: true, key };
  },

  async remove(owner: Owner, kind: MediaKind, key: string): Promise<Result> {
    const business = await businessRepository.findByOwner(owner.id);
    if (!business) return { ok: false, error: "Nothing to remove." };

    if (kind === "promotion" || kind === "banner") {
      // Throws away a picture that was sent but never saved (the save failed). A picture a promotion or banner
      // already uses is never deleted here: that happens when the promotion is saved without it.
      // Only this kind's own files (named "<kind>-…"), so a logo or gallery photo can never be removed this way.
      const ownUpload = keyBelongsTo(key, business.id) && key.startsWith(`business/${business.id}/${kind}-`);
      if (ownUpload && !(await mediaRepository.isReferenced(key))) await storage.remove(key);
      return { ok: true };
    }

    if (kind === "gallery") {
      // Only a key this business really owns can be removed.
      if (!business.gallery.includes(key)) return { ok: false, error: "That photo isn't in your gallery." };
      await businessRepository.update(business.id, owner.id, { gallery: business.gallery.filter((k) => k !== key) });
      await storage.remove(key);
      return { ok: true };
    }
    const current = kind === "logo" ? business.logoKey : business.coverKey;
    await businessRepository.update(business.id, owner.id, kind === "logo" ? { logoKey: "" } : { coverKey: "" });
    if (current) await storage.remove(current);
    return { ok: true };
  },
};
