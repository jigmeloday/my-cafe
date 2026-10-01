import { Brand } from "@/components/public/brand";
import { Container } from "@/components/shared/container";

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
