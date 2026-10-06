import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary: maroon -> dark maroon on hover, grey when disabled
        default:
          "bg-primary text-primary-foreground hover:bg-maroon-dark disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
        // Secondary: white, dark outline, soft grey fill on hover
        secondary:
          "border-foreground bg-surface text-foreground hover:bg-muted disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
        outline:
          "border-border bg-surface text-foreground hover:border-foreground hover:bg-muted aria-expanded:border-foreground disabled:bg-muted disabled:text-muted-foreground",
        // Selected state, e.g. "Following"
        soft: "border-primary/40 bg-maroon-soft text-primary hover:border-primary disabled:bg-muted disabled:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground disabled:text-muted-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 disabled:bg-muted disabled:text-muted-foreground",
        // Text link: maroon, underlined
        link: "h-auto rounded-none p-0 text-primary underline underline-offset-4 hover:text-maroon-dark active:scale-100 disabled:text-muted-foreground",
      },
      size: {
        default:
          "h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-11",
        "icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={!props.render}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
