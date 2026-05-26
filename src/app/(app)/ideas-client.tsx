"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/components/idea-card";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, STOPS, STOPS_BY_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { IdeaRow, StarRow, IdeaCategory } from "@/lib/types";

interface Props {
  initialIdeas: IdeaRow[];
  initialStars: StarRow[];
  myProfileId: string;
}

const MAIN_STOPS = STOPS.filter((s) => s.type === "main");

export function IdeasClient({ initialIdeas, initialStars, myProfileId }: Props) {
  const [ideas] = useState<IdeaRow[]>(initialIdeas);
  const [stars, setStars] = useState<StarRow[]>(initialStars);
  const [stopFilter, setStopFilter] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<IdeaCategory | null>(null);
  const [dogOnly, setDogOnly] = useState(false);
  const [townOnly, setTownOnly] = useState(false);
  const [easyOnly, setEasyOnly] = useState(false);
  const [hideSkipped, setHideSkipped] = useState(true);
  const [starredOnly, setStarredOnly] = useState(false);
  const [unscheduledOnly, setUnscheduledOnly] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("stars-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "stars" }, (payload) => {
        setStars((prev) => {
          if (payload.eventType === "DELETE") {
            const o = payload.old as Partial<StarRow>;
            return prev.filter((s) => !(s.profile_id === o.profile_id && s.idea_id === o.idea_id));
          }
          const n = payload.new as StarRow;
          if (prev.some((s) => s.profile_id === n.profile_id && s.idea_id === n.idea_id)) return prev;
          return [...prev, n];
        });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const starsByIdea = useMemo(() => {
    const m = new Map<string, StarRow[]>();
    for (const s of stars) {
      const arr = m.get(s.idea_id) ?? [];
      arr.push(s);
      m.set(s.idea_id, arr);
    }
    return m;
  }, [stars]);

  async function toggleStar(ideaId: string) {
    const supabase = createClient();
    const mine = stars.some((s) => s.idea_id === ideaId && s.profile_id === myProfileId);
    const before = stars;
    if (mine) {
      setStars((p) => p.filter((s) => !(s.idea_id === ideaId && s.profile_id === myProfileId)));
      const { error } = await supabase.from("stars").delete().eq("idea_id", ideaId).eq("profile_id", myProfileId);
      if (error) { setStars(before); toast.error(error.message); }
    } else {
      setStars((p) => [...p, { idea_id: ideaId, profile_id: myProfileId, created_at: new Date().toISOString() }]);
      const { error } = await supabase.from("stars").insert({ idea_id: ideaId, profile_id: myProfileId });
      if (error) { setStars(before); toast.error(error.message); }
    }
  }

  const filtered = useMemo(() => {
    return ideas.filter((i) => {
      if (hideSkipped && i.status === "skipped") return false;
      if (starredOnly && !(starsByIdea.get(i.id)?.length)) return false;
      if (unscheduledOnly && i.pinned_day) return false;
      if (stopFilter && i.stop_id !== stopFilter) return false;
      if (catFilter && i.category !== catFilter) return false;
      if (dogOnly && i.dog_ok === "no") return false;
      if (townOnly && !i.in_town) return false;
      if (easyOnly && !i.low_walking) return false;
      return true;
    });
  }, [ideas, hideSkipped, starredOnly, unscheduledOnly, starsByIdea, stopFilter, catFilter, dogOnly, townOnly, easyOnly]);

  return (
    <div className="container-prose py-6 md:py-10 space-y-6">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <p className="text-canyon text-xs font-medium uppercase tracking-widest">Aug 7 – Sep 24 · 3,312 mi</p>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-balance">Things to do along the way</h1>
          <p className="text-ink-muted text-pretty max-w-2xl">Star what you&rsquo;d like to do, then pin favorites to a day. Dog-, town-, and low-walking friendly options are tagged for you and Tucker.</p>
        </div>
        <Button asChild><Link href="/add"><Plus className="h-4 w-4" /> Add idea</Link></Button>
      </header>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={starredOnly} onClick={() => setStarredOnly((v) => !v)} label="★ Want to do" />
          <Chip active={unscheduledOnly} onClick={() => setUnscheduledOnly((v) => !v)} label="Not scheduled yet" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={dogOnly} onClick={() => setDogOnly((v) => !v)} label="Dog OK" />
          <Chip active={townOnly} onClick={() => setTownOnly((v) => !v)} label="In town" />
          <Chip active={easyOnly} onClick={() => setEasyOnly((v) => !v)} label="Low walking" />
          <span className="w-px bg-edge mx-1" />
          {MAIN_STOPS.map((s) => (
            <Chip key={s.id} active={stopFilter === s.id} onClick={() => setStopFilter(stopFilter === s.id ? null : s.id)} label={s.city} dot={s.color} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORIES) as IdeaCategory[]).map((c) => (
            <Chip key={c} small active={catFilter === c} onClick={() => setCatFilter(catFilter === c ? null : c)} label={CATEGORIES[c]} />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-ink-muted">No ideas match. Try clearing a filter, or <Link href="/add" className="text-canyon underline">add one</Link>.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((idea) => {
            const s = starsByIdea.get(idea.id) ?? [];
            return (
              <IdeaCard
                key={idea.id}
                idea={idea}
                stop={idea.stop_id ? STOPS_BY_ID[idea.stop_id] ?? null : null}
                starCount={s.length}
                starredByMe={s.some((x) => x.profile_id === myProfileId)}
                onToggleStar={toggleStar}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, label, dot, small }: { active: boolean; onClick: () => void; label: string; dot?: string; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-canyon",
        small ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        active ? "bg-canyon text-paper border-canyon-dark" : "bg-paper text-ink-muted border-edge hover:border-ink-soft hover:text-ink",
      )}
    >
      {dot && <span className="h-2 w-2 rounded-full" style={{ background: active ? "#fff" : dot }} />}
      {label}
    </button>
  );
}
