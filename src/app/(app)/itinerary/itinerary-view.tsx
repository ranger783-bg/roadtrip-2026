"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  List, CalendarDays, Home, Moon, Car, Camera, Building2, UtensilsCrossed, ShoppingCart,
  Fuel, Footprints, Waves, Bird, TreePine, Coffee, type LucideIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { STOPS, tripDays, CATEGORIES, TIME_BLOCK_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { IdeaRow, IdeaCategory } from "@/lib/types";

const CAT_ICON: Record<IdeaCategory, LucideIcon> = {
  scenic_drive: Car, sight: Camera, town: Building2, food: UtensilsCrossed, grocery: ShoppingCart,
  fuel: Fuel, hike: Footprints, water: Waves, wildlife: Bird, forest_road: TreePine, rest: Coffee,
};

export function ItineraryView({ pinned }: { pinned: IdeaRow[] }) {
  const [tab, setTab] = useState("list");
  const days = useMemo(() => tripDays(), []);

  const byDay = useMemo(() => {
    const m = new Map<string, IdeaRow[]>();
    for (const i of pinned) {
      if (!i.pinned_day) continue;
      const arr = m.get(i.pinned_day) ?? [];
      arr.push(i);
      m.set(i.pinned_day, arr);
    }
    return m;
  }, [pinned]);

  const mainStops = STOPS.filter((s) => s.type === "main");

  return (
    <div className="container-prose py-6 md:py-10 space-y-6">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <p className="text-canyon text-xs font-medium uppercase tracking-widest">49 days · 15 stops</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-balance">The itinerary</h1>
          <p className="text-ink-muted text-pretty">Campground stops are fixed; pinned ideas show up on their day. Switch between the list and the calendar.</p>
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="list"><List className="h-4 w-4" /> List</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="h-4 w-4" /> Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
        {mainStops.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} /> {s.city}</span>
        ))}
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#b8ad99]" /> Overnight</span>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsContent value="list" className="space-y-3">
          {STOPS.map((stop) => {
            const stopDays = days.filter((d) => d.stop?.id === stop.id);
            const ideasHere = stop.nights > 0
              ? pinned.filter((i) => i.pinned_day && i.pinned_day >= stop.arrival && i.pinned_day < stop.departure)
              : [];
            return (
              <article key={stop.id} className="bg-paper border border-edge rounded-lg shadow-card overflow-hidden">
                <div className="flex">
                  <div className="w-1.5 shrink-0" style={{ background: stop.color }} />
                  <div className="flex-1 p-4">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
                        {stop.type === "endpoint" ? <Home className="h-4 w-4 text-ink-soft" /> : null}
                        {stop.name}
                      </h3>
                      <span className="text-xs text-ink-muted">
                        {stop.nights > 0 ? `${formatDate(stop.arrival)} → ${formatDate(stop.departure)} · ${stop.nights} ${stop.nights === 1 ? "night" : "nights"}` : formatDate(stop.arrival)}
                      </span>
                    </div>
                    <p className="text-sm text-ink-muted mt-1 text-pretty">{stop.blurb}</p>
                    {ideasHere.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {ideasHere.map((i) => {
                          const Icon = CAT_ICON[i.category];
                          return (
                            <li key={i.id}>
                              <Link href={`/ideas/${i.id}`} className="flex items-center gap-2 text-sm rounded-md border border-edge bg-sand-soft px-2.5 py-1.5 hover:border-ink-soft">
                                <Icon className="h-4 w-4 text-pine shrink-0" />
                                <span className="font-medium">{formatDate(i.pinned_day!)}</span>
                                <span className="text-ink-muted">·</span>
                                <span className="flex-1 line-clamp-1">{i.title}</span>
                                <span className="text-[10px] text-ink-soft">{TIME_BLOCK_LABEL[i.time_block]}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {stop.nights > 0 && ideasHere.length === 0 && stopDays.length > 0 && (
                      <p className="text-xs text-ink-soft mt-2 italic">Nothing pinned yet — star ideas and pin them to a day.</p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarGrid days={days} byDay={byDay} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CalendarGrid({ days, byDay }: { days: { date: string; stop: import("@/lib/types").Stop | null }[]; byDay: Map<string, IdeaRow[]> }) {
  // Build weeks (Sun-Sat) spanning the trip.
  const first = new Date(days[0].date + "T00:00:00");
  const startPad = first.getDay(); // 0=Sun
  const cells: ({ date: string; stop: import("@/lib/types").Stop | null } | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (const d of days) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="bg-paper border border-edge rounded-lg shadow-card p-2 sm:p-4 overflow-x-auto">
      <div className="grid grid-cols-7 gap-1 min-w-[560px]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-ink-soft pb-1">{d}</div>
        ))}
        {weeks.flat().map((cell, idx) => {
          if (!cell) return <div key={idx} className="aspect-square rounded-md bg-sand-soft/40" />;
          const ideas = byDay.get(cell.date) ?? [];
          const [, m, d] = cell.date.split("-").map(Number);
          const tint = cell.stop ? `${cell.stop.color}22` : "transparent";
          const border = cell.stop ? cell.stop.color : "#e7dcc8";
          return (
            <div key={idx} className="aspect-square rounded-md border p-1 flex flex-col" style={{ background: tint, borderColor: border }} title={cell.stop?.name ?? ""}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-ink">{m}/{d}</span>
                {cell.stop && cell.stop.nights > 0 && <Moon className="h-2.5 w-2.5 text-ink-soft" />}
              </div>
              <div className="flex flex-wrap gap-0.5 mt-auto">
                {ideas.slice(0, 4).map((i) => {
                  const Icon = CAT_ICON[i.category];
                  return (
                    <Link key={i.id} href={`/ideas/${i.id}`} title={i.title} className="text-pine hover:text-canyon">
                      <Icon className="h-3 w-3" />
                    </Link>
                  );
                })}
                {ideas.length > 4 && <span className="text-[9px] text-ink-soft">+{ideas.length - 4}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-ink-soft mt-3">Day tint = where you sleep that night. Icons = pinned ideas (tap to open). Pin ideas from any idea&rsquo;s page.</p>
    </div>
  );
}
