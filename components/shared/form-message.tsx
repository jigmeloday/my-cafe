import { cn } from "@/lib/utils";

interface FormMessageProps {
  tone: "error" | "success";
  children: React.ReactNode;
}

export function FormMessage({ tone, children }: FormMessageProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        tone === "error"
          ? "bg-destructive/10 text-destructive"
          : "bg-success/10 text-success",
      )}
    >
      {children}
    </p>
  );
}
