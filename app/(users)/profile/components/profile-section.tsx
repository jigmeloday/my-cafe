interface ProfileSectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ProfileSection({
  id,
  title,
  description,
  children,
}: ProfileSectionProps) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <div className="space-y-1">
        <h2 id={id}>{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
