import { parsePage } from "@/lib/pagination";
import type { WalletListQuery } from "@/types/admin-wallet";

const BASE = "/admin/wallets";
type Params = Record<string, string | string[] | undefined>;

export function parseWalletQuery(params: Params): WalletListQuery {
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  return { q: (raw ?? "").trim().slice(0, 100), page: parsePage(params.page) };
}

export function walletsHref({ q, page }: Partial<WalletListQuery>) {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${BASE}?${query}` : BASE;
}
