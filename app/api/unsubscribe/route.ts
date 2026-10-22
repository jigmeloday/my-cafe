import { NextResponse } from "next/server";

import { LIMITS, clientIp, rateLimit } from "@/services/auth/rate-limit.service";
import { unsubscribeService } from "@/services/profile/unsubscribe.service";

/**
 * The "one-click" unsubscribe that mail apps send themselves (RFC 8058): a POST to the address in the email's
 * List-Unsubscribe header. Only POST changes anything; opening the link in a browser (GET) just shows the page,
 * so mail scanners that open links can't unsubscribe people by accident.
 */
export async function POST(request: Request) {
  const ipKey = `unsubscribe:ip:${await clientIp()}`;
  if (await rateLimit.isBlocked(ipKey, LIMITS.unsubscribePerIp)) return new Response(null, { status: 429 });
  await rateLimit.record(ipKey);

  const token = new URL(request.url).searchParams.get("token") ?? "";
  return (await unsubscribeService.run(token)) ? new Response(null, { status: 200 }) : new Response(null, { status: 400 });
}

export function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  return NextResponse.redirect(new URL(`/unsubscribe?token=${encodeURIComponent(token)}`, request.url), 303);
}
