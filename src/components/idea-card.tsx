"use client";

import Link from "next/link";
import { Star, Dog, Building2, Footprints, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/placeholder-image";
import { CATEGORIES } from "@/lib/constants";
import { cn, formatCost } from "@/lib/utils";
import type { IdeaRow, Stop } from "@/lib/types";

interface IdeaCardProps {
  idea: IdeaRow;
  stop: Stop | null;
  starCount: number;
  starredByMe: boolean;
  onToggleStar: (id: string) => void;
}

export function IdeaCard({ idea, stop, starCount, starredByMe, onToggleStar }: IdeaCardProps) {
  return (
    <div className="group flex flex-col bg-paper border border-edge rounded-lg overflow-hidden shadow-card hover:shadow-lift transition-shadow">
      <Link href={`/ideas/${idea.id}`} className="relative h-40 block">
        <PlaceholderImage category={idea.category} src={idea.photo_url} alt={idea.title} />
        {stop && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-paper shadow-soft" style={{ background: stop.color }}>
            <MapPin className="h-3 w-3" /> {stop.city}
          </span>
        )}
        {idea.status === "planned" && (
          <span className="absolute top-2 right-2"><Badge variant="pine" size="sm">Planned</Badge></span>
        )}
      </Link>

      <div className="flex-1 flex flex-col p-4 gap-3">
        <div className="flex-1">
          <Link href={`/ideas/${idea.id}`}>
            <h3 className="font-serif text-lg font-semibold leading-tight text-balance group-hover:text-canyon-dark transition-colors">{idea.title}</h3>
          </Link>
          <p className="mt-1.5 text-sm text-ink-muted line-clamp-2 text-pretty">{idea.description}</p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" size="sm">{CATEGORIES[idea.category]}</Badge>
          {idea.dog_ok === "yes" && <Badge variant="pine" size="sm"><Dog className="h-3 w-3" /> Dog OK</Badge>}
          {idea.dog_ok === "maybe" && <Badge variant="neutral" size="sm"><Dog className="h-3 w-3" /> Dog: maybe</Badge>}
          {idea.in_town && <Badge variant="sky" size="sm"><Building2 className="h-3 w-3" /> In town</Badge>}
          {idea.low_walking && <Badge variant="neutral" size="sm"><Footprints className="h-3 w-3" /> Low walking</Badge>}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-edge">
          <span className="text-xs text-ink-muted">{formatCost(idea.cost_low, idea.cost_high)}</span>
          <button
            onClick={() => onToggleStar(idea.id)}
            aria-pressed={starredByMe}
            className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors", starredByMe ? "bg-amber-50 border-amber text-canyon-dark" : "bg-paper border-edge text-ink-muted hover:border-ink-soft")}
          >
            <Star className={cn("h-3.5 w-3.5", starredByMe && "fill-amber text-amber")} />
            {starCount > 0 ? starCount : "Want to do"}
          </button>
        </div>
      </div>
    </div>
  );
}
