import { Brand } from "@/components/public/brand";

import { BusinessNav } from "./business-nav";

export function BusinessSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r bg-surface px-4 py-5 lg:flex">
      <div className="px-3">
        <Brand />
      </div>
      <BusinessNav />
    </aside>
  );
}
