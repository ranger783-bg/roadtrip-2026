import {
  Car, Camera, Building2, UtensilsCrossed, ShoppingCart, Fuel, Footprints,
  Waves, Bird, TreePine, Coffee, type LucideIcon,
} from "lucide-react";
import type { IdeaCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<IdeaCategory, LucideIcon> = {
  scenic_drive: Car,
  sight: Camera,
  town: Building2,
  food: UtensilsCrossed,
  grocery: ShoppingCart,
  fuel: Fuel,
  hike: Footprints,
  water: Waves,
  wildlife: Bird,
  forest_road: TreePine,
  rest: Coffee,
};

const GRADIENTS: Record<IdeaCategory, string> = {
  scenic_drive: "from-sky-dark via-sky to-pine",
  sight: "from-amber via-canyon to-canyon-dark",
  town: "from-canyon via-canyon-dark to-ink",
  food: "from-canyon to-amber",
  grocery: "from-pine via-pine-dark to-ink",
  fuel: "from-ink via-ink-muted to-ink-soft",
  hike: "from-pine-dark via-pine to-pine-light",
  water: "from-sky-dark via-sky to-sky",
  wildlife: "from-pine-dark via-pine to-amber",
  forest_road: "from-pine-dark via-pine to-pine-light",
  rest: "from-amber via-canyon to-canyon-dark",
};

export function PlaceholderImage({
  category,
  src,
  alt,
  className,
}: {
  category: IdeaCategory;
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  const Icon = ICONS[category] ?? Camera;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} className={cn("h-full w-full object-cover", className)} loading="lazy" />;
  }
  return (
    <div className={cn("relative h-full w-full flex items-center justify-center bg-gradient-to-br overflow-hidden", GRADIENTS[category], className)} aria-hidden>
      <svg className="absolute inset-0 h-full w-full opacity-15" viewBox="0 0 400 240" preserveAspectRatio="none">
        <path d="M0,180 L80,120 L160,160 L240,80 L320,140 L400,100 L400,240 L0,240 Z" fill="white" />
        <path d="M0,200 L60,150 L130,180 L210,120 L280,170 L360,140 L400,160 L400,240 L0,240 Z" fill="white" opacity="0.5" />
      </svg>
      <Icon className="relative h-12 w-12 text-paper/85" strokeWidth={1.5} />
    </div>
  );
}
