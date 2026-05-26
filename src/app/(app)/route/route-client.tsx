"use client";

import dynamic from "next/dynamic";
import { Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STOPS, MAIN_ROUTE, googleRouteUrl } from "@/lib/constants";

const RouteMap = dynamic(() => import("./route-map"), {
  ssr: false,
  loading: () => <div className="h-[60vh] min-h-[380px] w-full rounded-lg border border-edge bg-sand-soft animate-pulse flex items-center justify-center text-ink-soft text-sm">Loading map…</div>,
});

export function RouteClient() {
  const full = googleRouteUrl(MAIN_ROUTE);
  const outbound = googleRouteUrl(STOPS.slice(0, 7)); // Yuma → West Glacier
  const ret = googleRouteUrl(STOPS.slice(6)); // West Glacier → home

  return (
    <div className="container-prose py-6 md:py-10 space-y-5">
      <header className="space-y-1">
        <p className="text-canyon text-xs font-medium uppercase tracking-widest">3,312 miles · round trip</p>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-balance">The whole route</h1>
        <p className="text-ink-muted text-pretty max-w-2xl">All 15 stops, numbered in order. Big dots are the long stays. Open it in Google Maps for turn-by-turn — split into outbound and return legs to stay under Google&rsquo;s waypoint limit.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="primary"><a href={full} target="_blank" rel="noopener noreferrer"><Navigation className="h-4 w-4" /> Main stops route</a></Button>
        <Button asChild variant="secondary"><a href={outbound} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> Outbound (Yuma → Glacier)</a></Button>
        <Button asChild variant="secondary"><a href={ret} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> Return (Glacier → home)</a></Button>
      </div>

      <RouteMap />

      <ol className="grid gap-1.5 sm:grid-cols-2">
        {STOPS.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-sm">
            <span className="h-5 w-5 shrink-0 rounded-full text-[10px] font-semibold text-paper flex items-center justify-center" style={{ background: s.color }}>{s.seq}</span>
            <span className="font-medium">{s.city}, {s.state}</span>
            <span className="text-ink-soft text-xs">{s.nights > 0 ? `${s.nights}n` : "—"}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
