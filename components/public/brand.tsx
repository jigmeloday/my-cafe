import Link from "next/link";
import { MapPin } from "lucide-react";

import { SITE_NAME } from "./constant/site.constant";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary">
      <MapPin className="size-6" />
      <span className="text-xl font-bold tracking-tight">{SITE_NAME}</span>
    </Link>
  );
}
