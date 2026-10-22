import { KYC_PREFIX_REGEX } from "@/lib/kyc-regex";

/** The documents a business sends to be verified. `id` and `license` are required, `premises` is optional. */
export const KYC_DOCS = [
  { kind: "id", label: "ID document", hint: "Your citizenship ID (CID) card or passport. Photo or PDF, up to 5 MB.", required: true },
  { kind: "license", label: "Trade licence", hint: "Your business or trade licence. Photo or PDF, up to 5 MB.", required: true },
  { kind: "premises", label: "Shop front photo", hint: "Optional. A photo of your shop or workplace.", required: false },
] as const;

export type KycDocKind = (typeof KYC_DOCS)[number]["kind"];
export const KYC_KINDS = KYC_DOCS.map((d) => d.kind) as [KycDocKind, ...KycDocKind[]];

/** Uploads one person may make in an hour, so the upload form can't be used to fill the storage. */
export const KYC_UPLOADS_PER_HOUR = 20;

/**
 * How long ID and licence files, and the ID and licence numbers, are kept after we decide on a request.
 * After that `npm run purge:kyc` deletes them. The Privacy Policy states this number, so change both together.
 */
export const KYC_RETENTION_DAYS = 30;

/** Where a business's documents live in the (private) bucket. */
export const kycPrefix = (businessId: string) => `kyc/${businessId}/`;

/** A stored document name, e.g. kyc/<businessId>/id-ab12cd34.pdf */
export const KYC_KEY_PATTERN = KYC_PREFIX_REGEX;
export const kycKeyBelongsTo = (key: string, businessId: string) => KYC_KEY_PATTERN.test(key) && key.startsWith(kycPrefix(businessId));
