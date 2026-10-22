import { randomBytes } from "node:crypto";

import { kycKeyBelongsTo, kycPrefix, KYC_UPLOADS_PER_HOUR, type KycDocKind } from "@/lib/kyc";
import { storage } from "@/lib/storage";
import type { KycInput, KycReviewInput } from "@/lib/validations/kyc.schema";
import { businessRepository } from "@/server/repositories/business.repository";
import { kycRepository } from "@/server/repositories/kyc.repository";
import { rateLimit } from "@/services/auth/rate-limit.service";
import { businessNotifyService } from "@/services/business/business-notify.service";
import { businessService, type Owner } from "@/services/business/business.service";

type Result = { ok: true; message?: string } | { ok: false; error: string };

const toBhutan = (d: Date) => new Date(d.getTime() + 6 * 3_600_000).toISOString().slice(0, 16);
const UPLOAD_LIMIT = { max: KYC_UPLOADS_PER_HOUR, windowMs: 60 * 60_000 } as const;

/** Where a business stands, as the owner sees it. */
export type KycState =
  | { state: "NO_BUSINESS" }
  | { state: "VERIFIED" }
  | { state: "NOT_SUBMITTED" }
  | { state: "PENDING"; submittedAt: string }
  | { state: "REJECTED"; submittedAt: string; reason: string };

export interface KycQueueItem {
  id: string;
  businessName: string;
  ownerName: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface KycDetail extends KycQueueItem {
  businessSlug: string;
  businessStatus: "PENDING" | "VERIFIED" | "SUSPENDED";
  accountName: string;
  accountEmail: string;
  idNumber: string;
  licenseNumber: string;
  docs: { kind: KycDocKind; label: string; key: string }[];
  /** True once the files and numbers were deleted after the retention period. */
  purged: boolean;
  reviewNote: string;
  reviewedAt: string | null;
}

export const kycService = {
  async state(ownerId: string): Promise<KycState> {
    const business = await businessRepository.findByOwner(ownerId);
    if (!business) return { state: "NO_BUSINESS" };
    if (business.status === "VERIFIED") return { state: "VERIFIED" };
    const latest = await kycRepository.latestForBusiness(business.id);
    if (!latest) return { state: "NOT_SUBMITTED" };
    if (latest.status === "PENDING") return { state: "PENDING", submittedAt: toBhutan(latest.submittedAt) };
    if (latest.status === "REJECTED") return { state: "REJECTED", submittedAt: toBhutan(latest.submittedAt), reason: latest.reviewNote };
    return { state: "VERIFIED" };
  },

  /** Stores one document in the private bucket. The file is only a file until a request that names it is sent. */
  async uploadDocument(owner: Owner, kind: KycDocKind, bytes: Uint8Array, type: { ext: string }): Promise<{ ok: true; key: string } | { ok: false; error: string }> {
    const limitKey = `kyc-upload:${owner.id}`;
    if (await rateLimit.isBlocked(limitKey, UPLOAD_LIMIT)) return { ok: false, error: "You've uploaded a lot of files. Please wait a while and try again." };
    const business = await businessService.ensure(owner);
    if (business.status === "VERIFIED") return { ok: false, error: "Your business is already verified." };

    await rateLimit.record(limitKey);
    const key = `${kycPrefix(business.id)}${kind}-${randomBytes(8).toString("hex")}.${type.ext}`;
    await storage.put(key, bytes, type.ext === "pdf" ? "application/pdf" : `image/${type.ext === "jpg" ? "jpeg" : type.ext}`);
    return { ok: true, key };
  },

  /** The owner sends their documents for review. One waiting request at a time. */
  async submit(owner: Owner, input: KycInput): Promise<Result> {
    const business = await businessService.ensure(owner);
    if (business.status === "VERIFIED") return { ok: false, error: "Your business is already verified." };
    if (business.status === "SUSPENDED") return { ok: false, error: "This account can't be verified right now. Please contact us." };

    const latest = await kycRepository.latestForBusiness(business.id);
    if (latest?.status === "PENDING") return { ok: false, error: "Your request is already being reviewed." };

    // The files must be ones this business uploaded, never somebody else's.
    const keys = [input.idDocKey, input.licenseDocKey, ...(input.premisesKey ? [input.premisesKey] : [])];
    if (!keys.every((k) => kycKeyBelongsTo(k, business.id))) return { ok: false, error: "One of the files isn't valid. Upload it again." };

    await kycRepository.create({
      businessId: business.id,
      ownerName: input.ownerName,
      idNumber: input.idNumber,
      licenseNumber: input.licenseNumber,
      idDocKey: input.idDocKey,
      licenseDocKey: input.licenseDocKey,
      premisesKey: input.premisesKey,
    });
    return { ok: true, message: "Sent. We'll review your documents and let you know." };
  },

  // ---- admin ----

  async queue(status: "PENDING" | "ALL"): Promise<KycQueueItem[]> {
    return (await kycRepository.list(status)).map((s) => ({ id: s.id, businessName: s.business.name, ownerName: s.ownerName, submittedAt: toBhutan(s.submittedAt), status: s.status }));
  },

  async pendingCount() {
    return kycRepository.countPending();
  },

  async detail(id: string): Promise<KycDetail | null> {
    const s = await kycRepository.findById(id);
    if (!s) return null;
    return {
      id: s.id,
      businessName: s.business.name,
      businessSlug: s.business.slug,
      businessStatus: s.business.status,
      ownerName: s.ownerName,
      accountName: s.business.owner.name,
      accountEmail: s.business.owner.email,
      idNumber: s.idNumber,
      licenseNumber: s.licenseNumber,
      submittedAt: toBhutan(s.submittedAt),
      status: s.status,
      reviewNote: s.reviewNote,
      reviewedAt: s.reviewedAt ? toBhutan(s.reviewedAt) : null,
      // Files deleted after the retention period have an empty key and are not listed.
      docs: [
        { kind: "id" as const, label: "ID document", key: s.idDocKey },
        { kind: "license" as const, label: "Trade licence", key: s.licenseDocKey },
        { kind: "premises" as const, label: "Shop front photo", key: s.premisesKey },
      ].filter((doc) => doc.key),
      purged: s.status !== "PENDING" && !s.idDocKey,
    };
  },

  /** An admin approves or rejects a waiting request. Rejecting needs a reason the owner can act on. */
  async review(admin: { id: string; email: string }, { id, decision, note }: KycReviewInput, now = new Date()): Promise<Result> {
    const s = await kycRepository.findById(id);
    if (!s) return { ok: false, error: "We couldn't find that request." };
    if (s.status !== "PENDING") return { ok: false, error: "Someone else already reviewed this." };

    const done = await kycRepository.review({
      id,
      decision,
      note,
      adminId: admin.id,
      now,
      notice:
        decision === "APPROVED"
          ? { userId: s.business.owner.id, title: "Your business is verified", description: "Thank you. Your business now shows the Verified badge on Nook.", href: "/business/verification" }
          : { userId: s.business.owner.id, title: "Your verification needs changes", description: `We couldn't verify your business yet: ${note} You can send your documents again.`, href: "/business/verification" },
      // The audit line names the business, never the owner's ID details.
      audit: { actorId: admin.id, actorEmail: admin.email, action: decision === "APPROVED" ? "kyc.approve" : "kyc.reject", targetId: id, targetLabel: `Verification: ${s.business.name}` },
    });
    if (!done) return { ok: false, error: "Someone else already reviewed this." };
    if (decision === "APPROVED") await businessNotifyService.verified(s.business.owner, s.business.name);
    return { ok: true, message: decision === "APPROVED" ? `${s.business.name} is verified.` : "Sent back to the owner." };
  },

  /**
   * An admin opens one document. Only files that belong to a real request are served, and every opening is
   * written to the audit log, so there is a record of who looked at identity documents.
   */
  async openDocument(admin: { id: string; email: string }, key: string) {
    const owner = await kycRepository.findByFileKey(key);
    if (!owner) return null;
    const object = await storage.get(key);
    await kycRepository.logView({ actorId: admin.id, actorEmail: admin.email, action: "kyc.view", targetId: owner.id, targetLabel: `Opened a document: ${owner.business.name}` });
    return object;
  },
};
