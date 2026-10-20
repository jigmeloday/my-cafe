import type { Metadata } from "next";

import { NO_INDEX } from "@/lib/seo/metadata";
import { Brand } from "@/components/public/brand";
import { Container } from "@/components/shared/container";


// Accounts and dashboards are private, so search engines are asked to leave them out.
export const metadata: Metadata = NO_INDEX;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <Container className="py-4">
          <Brand />
        </Container>
      </header>
      <main className="flex flex-1 justify-center px-4 py-10 sm:py-16">
        {children}
      </main>
    </div>
  );
}
