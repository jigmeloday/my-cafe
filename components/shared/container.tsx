import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] px-3 sm:px-4 lg:px-6",
        className,
      )}
      {...props}
    />
  );
}
