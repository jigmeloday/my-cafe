import { BusinessHeader } from "@/components/business/header";
import { BusinessSidebar } from "@/components/business/sidebar";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <BusinessSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <BusinessHeader />
        <main className="w-full flex-1 px-4 py-4 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
