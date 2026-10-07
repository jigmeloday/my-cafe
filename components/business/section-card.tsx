interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section
      aria-label={title}
      className="space-y-4 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <div className="space-y-0.5">
        <h3>{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
