import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { requireRole } from "@/lib/session";
import { bannerService } from "@/services/banner/banner.service";

import { AdminBannerForm } from "../components/admin-banner-form";

export const metadata: Metadata = { title: "Create a banner — Nook admin" };

export default async function NewAdminBannerPage() {
  await requireRole("ADMIN");
  const businesses = await bannerService.businessOptions();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link href="/admin/banners" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Banners
        </Link>
        <div className="space-y-1">
          <h1>Create a banner</h1>
          <p className="text-sm text-muted-foreground">Pick a business, add an image and a headline, and choose how long it runs. The business isn&apos;t charged.</p>
        </div>
      </header>
      <AdminBannerForm businesses={businesses} />
    </div>
  );
}
