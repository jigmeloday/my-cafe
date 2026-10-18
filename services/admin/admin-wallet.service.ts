import type { Prisma } from "@/generated/prisma/client";
import { clampPage, totalPagesFor } from "@/lib/pagination";
import { escapeLike, parseSearch } from "@/lib/search";
import type { RechargeInput } from "@/lib/validations/recharge.schema";
import { adminWalletRepository as repo } from "@/server/repositories/admin-wallet.repository";
import type { WalletListQuery, WalletListResult } from "@/types/admin-wallet";

import type { Actor } from "./admin-user.service";

export const WALLETS_PAGE_SIZE = 10;

/** Every word typed must match the business name or its owner's email, in any order. */
export function buildWalletWhere(q: string): Prisma.BusinessWhereInput {
  const { words } = parseSearch(q);
  return {
    AND: words.map((word) => {
      const text = escapeLike(word);
      return {
        OR: [
          { name: { contains: text, mode: "insensitive" as const } },
          { owner: { email: { contains: text, mode: "insensitive" as const } } },
        ],
      };
    }),
  };
}

export const adminWalletService = {
  async list({ q, page }: WalletListQuery, pageSize = WALLETS_PAGE_SIZE): Promise<WalletListResult> {
    const where = buildWalletWhere(q);
    const total = await repo.count(where);
    const totalPages = totalPagesFor(total, pageSize);
    const current = clampPage(page, totalPages);
    const rows = await repo.list(where, (current - 1) * pageSize, pageSize);

    return {
      items: rows.map((b) => ({ businessId: b.id, name: b.name, slug: b.slug, ownerEmail: b.owner.email, balance: b.wallet?.balance ?? 0 })),
      total,
      page: current,
      pageSize,
      totalPages,
    };
  },

  async recharge(actor: Actor, { businessId, coins, note }: RechargeInput): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
    const result = await repo.recharge(businessId, coins, note ? `Added by admin: ${note}` : "Added by admin", {
      actorId: actor.id,
      actorEmail: actor.email,
      action: "wallet.recharge",
      targetId: businessId,
      targetLabel: "",
    });
    return result
      ? { ok: true, message: `Added ${coins.toLocaleString("en")} coins to ${result.name}. Balance: ${result.balance.toLocaleString("en")}.` }
      : { ok: false, error: "We couldn't find that business." };
  },
};
