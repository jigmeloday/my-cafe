import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/session";
import { engagementService } from "@/services/engagement/engagement.service";

/** What the signed-in person has saved and followed, so hearts and Follow buttons start in the right state. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ favorites: [], following: [] }, { headers: { "Cache-Control": "no-store" } });

  return NextResponse.json(await engagementService.snapshot(user.id), { headers: { "Cache-Control": "no-store" } });
}
