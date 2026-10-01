import Link from "next/link";

interface AuthCardProps {
  title: string;
  description?: string;
  footerText?: string;
  footerLink?: { label: string; href: string };
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  footerText,
  footerLink,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md space-y-8">
      <header className="space-y-2">
        <h1>{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </header>
      {children}
      {footerLink && (
        <p className="text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            href={footerLink.href}
            className="font-semibold text-primary hover:underline"
          >
            {footerLink.label}
          </Link>
        </p>
      )}
    </div>
  );
}
