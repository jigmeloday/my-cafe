import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: string;
}

function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col">
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-black/40 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30 flex field-sizing-content min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[0.5px] focus-visible:ring-primary-50 disabled:cursor-not-allowed disabled:opacity-50 md:text-md",
          className,
          error && "border-destructive"
        )}
        {...props}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}

export { Textarea };
