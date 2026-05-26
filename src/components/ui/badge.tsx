import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full font-medium leading-none", {
  variants: {
    variant: {
      neutral: "bg-sand-soft text-ink-muted border border-edge",
      canyon: "bg-canyon-50 text-canyon-dark",
      pine: "bg-pine-50 text-pine-dark",
      sky: "bg-sky-50 text-sky-dark",
      amber: "bg-amber-50 text-canyon-dark",
      outline: "border border-edge text-ink-muted",
      ink: "bg-ink text-sand",
    },
    size: { sm: "px-2 py-0.5 text-[11px]", md: "px-2.5 py-1 text-xs" },
  },
  defaultVariants: { variant: "neutral", size: "md" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
