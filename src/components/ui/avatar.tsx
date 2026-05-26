"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cn, initials } from "@/lib/utils";

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({
  name,
  src,
  color = "#b5552f",
  size = "md",
  className,
  title,
}: {
  name: string;
  src?: string | null;
  color?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
  title?: string;
}) {
  return (
    <AvatarPrimitive.Root
      className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full ring-2 ring-paper", sizeClasses[size], className)}
      title={title ?? name}
    >
      {src ? <AvatarPrimitive.Image src={src} alt={name} className="aspect-square h-full w-full object-cover" /> : null}
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center font-semibold text-paper"
        style={{ background: color }}
      >
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
