"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser, requireRole } from "@/lib/session";
import { orderSchema, type OrderInput } from "@/lib/validations/order.schema";
import { orderService } from "@/services/order/order.service";

import type { ActionResult } from "./action.type";

const id = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.length <= 100;

/** A signed-in customer orders a deal or sale item. */
export async function placeOrderAction(input: OrderInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in to place an order." };
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const result = await orderService.place({ id: user.id, role: user.role }, parsed.data);
  if (result.ok) {
    revalidatePath("/profile/orders");
    revalidatePath("/business/orders");
  }
  return result;
}

/** A customer takes back an order the seller hasn't answered yet. */
export async function cancelOrderAction(orderId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  if (!id(orderId)) return { ok: false, error: "We couldn't find that order." };

  const result = await orderService.cancelMine(user.id, orderId);
  if (result.ok) {
    revalidatePath("/profile/orders");
    revalidatePath("/business/orders");
  }
  return result;
}

/** A seller confirms, completes or cancels an order. */
export async function setOrderStatusAction(orderId: string, to: "CONFIRMED" | "COMPLETED" | "CANCELLED"): Promise<ActionResult> {
  const user = await requireRole("BUSINESS_OWNER");
  if (!id(orderId) || !["CONFIRMED", "COMPLETED", "CANCELLED"].includes(to)) return { ok: false, error: "We couldn't find that order." };

  const result = await orderService.setStatus(user.id, orderId, to);
  if (result.ok) {
    revalidatePath("/business/orders");
    revalidatePath("/profile/orders");
  }
  return result;
}
