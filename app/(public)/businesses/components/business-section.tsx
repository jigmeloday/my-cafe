interface BusinessSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function BusinessSection({ id, title, children }: BusinessSectionProps) {
  return (
    <section aria-labelledby={id} className="space-y-4 border-t pt-8">
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}
