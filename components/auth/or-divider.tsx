export function OrDivider({ children = "or" }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      {children}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
