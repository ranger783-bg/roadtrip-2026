"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  List, CalendarDays, Home, Moon, Plus, X, Search, ExternalLink,
  Car, Camera, Building2, UtensilsCrossed, ShoppingCart, Fuel, Footprints,
  Waves, Bird, TreePine, Coffee, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { STOPS, tripDays, TIME_BLOCK_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { IdeaRow, IdeaCategory, Stop } from "@/lib/types";

const CAT_ICON: Record<IdeaCategory, LucideIcon> = {
  scenic_drive: Car, sight: Camera, town: Building2, food: UtensilsCrossed, grocery: ShoppingCart,
  fuel: Fuel, hike: Footprints, water: Waves, wildlife: Bird, forest_road: TreePine, rest: Coffee,
};

export function ItineraryView({ initialIdeas }: { initialIdeas: IdeaRow[] }) {
  const [ideas, setIdeas] = useState<IdeaRow[]>(initialIdeas);
  const [tab, setTab] = useState("calendar");
  const [selDay, setSelDay] = useState<string | null>(null);
  const days = useMemo(() => tripDays(), []);
  const stopByDate = useMemo(() => new Map(days.map((d) => [d.date, d.stop])), [days]);
  const mainStops = STOPS.filter((s) => s.type === "main");

  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel("itinerary-ideas")
      .on("postgres_changes", { event: "*", schema: "public", table: "ideas" }, (p) => {
        setIdeas((prev) => {
          if (p.eventType === "DELETE") return prev.filter((i) => i.id !== (p.old as Partial<IdeaRow>).id);
          const n = p.new as IdeaRow;
          if (n.status === "skipped") return prev.filter((i) => i.id !== n.id);
          const without = prev.filter((i) => i.id !== n.id);
          return [...without, n];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const pinned = useMemo(() => ideas.filter((i) => i.pinned_day), [ideas]);
  const byDay = useMemo(() => {
    const m = new Map<string, IdeaRow[]>();
    for (const i of pinned) {
      const arr = m.get(i.pinned_day!) ?? [];
      arr.push(i);
      m.set(i.pinned_day!, arr);
    }
    return m;
  }, [pinned]);

  const pin = useCallback(async (ideaId: string, day: string | null) => {
    setIdeas((prev) => prev.map((i) => (i.id === ideaId ? { ...i, pinned_day: day, status: day ? "planned" : "idea" } : i)));
    const supabase = createClient();
    const { error } = await supabase.from("ideas").update({ pinned_day: day, status: day ? "planned" : "idea" }).eq("id", ideaId);
    if (error) toast.error(error.message);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setSelDay(null); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="container-prose py-6 md:py-10 space-y-6">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <p className="text-canyon text-xs font-medium uppercase tracking-widest">49 days · 15 stops</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-balance">The itinerary</h1>
          <p className="text-ink-muted text-pretty">Tap any day to pin ideas to it. Campground stops are fixed; the colors show which leg you&rsquo;re on.</p>
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="calendar"><CalendarDays className="h-4 w-4" /> Calendar</TabsTrigger>
            <TabsTrigger value="list"><List className="h-4 w-4" /> List</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
        {mainStops.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} /> {s.city}</span>
        ))}
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#b8ad99]" /> Overnight</span>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsContent value="calendar">
          <CalendarGrid days={days} byDay={byDay} onPick={setSelDay} />
        </TabsContent>
        <TabsContent value="list" className="space-y-3">
          {STOPS.map((stop) => {
            const ideasHere = stop.nights > 0 ? pinned.filter((i) => i.pinned_day! >= stop.arrival && i.pinned_day! < stop.departure) : [];
            return (
              <article key={stop.id} className="bg-paper border border-edge rounded-lg shadow-card overflow-hidden">
                <div className="flex">
                  <div className="w-1.5 shrink-0" style={{ background: stop.color }} />
                  <div className="flex-1 p-4">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
                        {stop.type === "endpoint" ? <Home className="h-4 w-4 text-ink-soft" /> : null}{stop.name}
                      </h3>
                      <span className="text-xs text-ink-muted">{stop.nights > 0 ? `${formatDate(stop.arrival)} → ${formatDate(stop.departure)} · ${stop.nights} ${stop.nights === 1 ? "night" : "nights"}` : formatDate(stop.arrival)}</span>
                    </div>
                    <p className="text-sm text-ink-muted mt-1 text-pretty">{stop.blurb}</p>
                    {ideasHere.length > 0 ? (
                      <ul className="mt-3 space-y-1.5">
                        {ideasHere.slice().sort((a, b) => a.pinned_day!.localeCompare(b.pinned_day!)).map((i) => {
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
                    ) : stop.nights > 0 ? (
                      <p className="text-xs text-ink-soft mt-2 italic">Nothing pinned yet — tap a day in the calendar to add.</p>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </TabsContent>
      </Tabs>

      {selDay && (
        <DayModal
          day={selDay}
          stop={stopByDate.get(selDay) ?? null}
          ideas={ideas}
          pinnedHere={byDay.get(selDay) ?? []}
          onClose={() => setSelDay(null)}
          onPin={pin}
        />
      )}
    </div>
  );
}

function CalendarGrid({ days, byDay, onPick }: { days: { date: string; stop: Stop | null }[]; byDay: Map<string, IdeaRow[]>; onPick: (d: string) => void }) {
  const first = new Date(days[0].date + "T00:00:00");
  const startPad = first.getDay();
  const cells: ({ date: string; stop: Stop | null } | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (const d of days) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-paper border border-edge rounded-lg shadow-card p-2 sm:p-4 overflow-x-auto">
      <div className="grid grid-cols-7 gap-1 min-w-[620px]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-ink-soft pb-1">{d}</div>
        ))}
        {cells.map((cell, idx) => {
          if (!cell) return <div key={idx} className="min-h-[68px] rounded-md bg-sand-soft/30" />;
          const dayIdeas = byDay.get(cell.date) ?? [];
          const [, m, d] = cell.date.split("-").map(Number);
          const tint = cell.stop ? `${cell.stop.color}22` : "transparent";
          const border = cell.stop ? cell.stop.color : "#e7dcc8";
          return (
            <button
              key={idx}
              onClick={() => onPick(cell.date)}
              className="min-h-[68px] rounded-md border p-1 flex flex-col text-left hover:ring-2 hover:ring-canyon/40 transition-shadow"
              style={{ background: tint, borderColor: border }}
              title={`${cell.stop?.name ?? "Travel day"} — tap to pin ideas`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-ink">{m}/{d}</span>
                {cell.stop && cell.stop.nights > 0 && <Moon className="h-2.5 w-2.5 text-ink-soft" />}
              </div>
              {cell.stop && <span className="text-[9px] leading-tight text-ink-muted line-clamp-1">{cell.stop.city}</span>}
              <div className="flex flex-wrap gap-0.5 mt-auto pt-0.5">
                {dayIdeas.slice(0, 4).map((i) => {
                  const Icon = CAT_ICON[i.category];
                  return <Icon key={i.id} className="h-3 w-3 text-pine" />;
                })}
                {dayIdeas.length > 4 && <span className="text-[9px] text-ink-soft">+{dayIdeas.length - 4}</span>}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-ink-soft mt-3">Tap a day to pin ideas. Day tint = where you sleep; icons = pinned ideas.</p>
    </div>
  );
}

function DayModal({ day, stop, ideas, pinnedHere, onClose, onPin }: {
  day: string; stop: Stop | null; ideas: IdeaRow[]; pinnedHere: IdeaRow[];
  onClose: () => void; onPin: (id: string, day: string | null) => void;
}) {
  const [q, setQ] = useState("");
  const pinnedIds = new Set(pinnedHere.map((i) => i.id));
  const candidates = ideas
    .filter((i) => !pinnedIds.has(i.id))
    .filter((i) => (q ? i.title.toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => {
      const as = a.stop_id === stop?.id ? 0 : 1;
      const bs = b.stop_id === stop?.id ? 0 : 1;
      return as - bs || a.title.localeCompare(b.title);
    });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 sm:p-4" onClick={onClose}>
      <div className="bg-paper w-full sm:max-w-md sm:rounded-lg rounded-t-2xl border border-edge shadow-lift max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-2 p-4 border-b border-edge">
          <div>
            <h2 className="font-serif text-xl font-semibold">{formatDate(day)}</h2>
            {stop ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted mt-0.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: stop.color }} /> {stop.name}
              </span>
            ) : <span className="text-sm text-ink-soft">Travel day</span>}
          </div>
          <button onClick={onClose} aria-label="Close" className="text-ink-soft hover:text-ink"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-ink-muted mb-2">Pinned this day</h3>
            {pinnedHere.length === 0 ? (
              <p className="text-sm text-ink-soft">Nothing yet — add from below.</p>
            ) : (
              <ul className="space-y-1.5">
                {pinnedHere.map((i) => {
                  const Icon = CAT_ICON[i.category];
                  return (
                    <li key={i.id} className="flex items-center gap-2 rounded-md border border-edge bg-sand-soft px-2.5 py-1.5">
                      <Icon className="h-4 w-4 text-pine shrink-0" />
                      <Link href={`/ideas/${i.id}`} className="flex-1 text-sm font-medium line-clamp-1 hover:text-canyon-dark">{i.title}</Link>
                      <Link href={`/ideas/${i.id}`} className="text-ink-soft hover:text-ink" title="Open"><ExternalLink className="h-3.5 w-3.5" /></Link>
                      <button onClick={() => onPin(i.id, null)} aria-label="Unpin" className="text-ink-soft hover:text-canyon"><X className="h-4 w-4" /></button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-ink-muted mb-2">Add an idea to this day</h3>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-soft" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ideas…" className="pl-8 h-9 text-sm" />
            </div>
            <ul className="space-y-1 max-h-56 overflow-y-auto">
              {candidates.length === 0 ? (
                <li className="text-sm text-ink-soft py-2 text-center">No ideas to add. <Link href="/add" className="text-canyon underline">Add one</Link>.</li>
              ) : candidates.map((i) => {
                const Icon = CAT_ICON[i.category];
                const sameStop = i.stop_id === stop?.id;
                return (
                  <li key={i.id}>
                    <button onClick={() => onPin(i.id, day)} className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sand-soft text-left">
                      <Icon className="h-4 w-4 text-ink-soft shrink-0" />
                      <span className="flex-1 line-clamp-1">{i.title}</span>
                      {sameStop && <span className="text-[10px] text-pine">here</span>}
                      <Plus className="h-4 w-4 text-canyon shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
