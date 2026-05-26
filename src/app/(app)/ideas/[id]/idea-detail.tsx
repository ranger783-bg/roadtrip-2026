"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, CalendarCheck, Ban, RotateCcw, Send, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { TRIP_START, TRIP_END, TIME_BLOCK_LABEL } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import type { IdeaRow, NoteRow, ProfileRow, StarRow, Stop, TimeBlock, IdeaStatus } from "@/lib/types";

interface Props {
  idea: IdeaRow;
  stop: Stop | null;
  initialStars: StarRow[];
  initialNotes: NoteRow[];
  profiles: ProfileRow[];
  myProfileId: string;
}

export function IdeaDetail({ idea, stop, initialStars, initialNotes, profiles, myProfileId }: Props) {
  const [stars, setStars] = useState<StarRow[]>(initialStars);
  const [notes, setNotes] = useState<NoteRow[]>(initialNotes);
  const [day, setDay] = useState<string>(idea.pinned_day ?? "");
  const [block, setBlock] = useState<TimeBlock>(idea.time_block);
  const [status, setStatus] = useState<IdeaStatus>(idea.status);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const profilesById = useMemo(() => new Map(profiles.map((p) => [p.id, p])), [profiles]);

  const minDay = stop && stop.nights > 0 ? stop.arrival : TRIP_START;
  const maxDay = stop && stop.nights > 0 ? stop.departure : TRIP_END;

  useEffect(() => {
    const supabase = createClient();
    const ch = supabase
      .channel(`idea-${idea.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "stars", filter: `idea_id=eq.${idea.id}` }, (p) => {
        setStars((prev) => {
          if (p.eventType === "DELETE") {
            const o = p.old as Partial<StarRow>;
            return prev.filter((s) => s.profile_id !== o.profile_id);
          }
          const n = p.new as StarRow;
          return prev.some((s) => s.profile_id === n.profile_id) ? prev : [...prev, n];
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "notes", filter: `idea_id=eq.${idea.id}` }, (p) => {
        setNotes((prev) => {
          if (p.eventType === "INSERT") {
            const n = p.new as NoteRow;
            return prev.some((x) => x.id === n.id) ? prev : [...prev, n];
          }
          if (p.eventType === "DELETE") {
            const o = p.old as Partial<NoteRow>;
            return prev.filter((x) => x.id !== o.id);
          }
          return prev;
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [idea.id]);

  const starredByMe = stars.some((s) => s.profile_id === myProfileId);

  async function toggleStar() {
    const supabase = createClient();
    const before = stars;
    if (starredByMe) {
      setStars((p) => p.filter((s) => s.profile_id !== myProfileId));
      const { error } = await supabase.from("stars").delete().eq("idea_id", idea.id).eq("profile_id", myProfileId);
      if (error) { setStars(before); toast.error(error.message); }
    } else {
      setStars((p) => [...p, { idea_id: idea.id, profile_id: myProfileId, created_at: new Date().toISOString() }]);
      const { error } = await supabase.from("stars").insert({ idea_id: idea.id, profile_id: myProfileId });
      if (error) { setStars(before); toast.error(error.message); }
    }
  }

  async function persist(patch: Partial<Pick<IdeaRow, "pinned_day" | "time_block" | "status">>) {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("ideas").update(patch).eq("id", idea.id);
    setBusy(false);
    if (error) toast.error(error.message);
  }

  async function onDayChange(value: string) {
    setDay(value);
    const next: IdeaStatus = value ? "planned" : "idea";
    setStatus(next);
    await persist({ pinned_day: value || null, status: next });
    toast.success(value ? `Pinned to ${formatDate(value)}` : "Unpinned");
  }
  async function onBlockChange(value: TimeBlock) {
    setBlock(value);
    await persist({ time_block: value });
  }
  async function skip() {
    setStatus("skipped");
    setDay("");
    await persist({ status: "skipped", pinned_day: null });
  }
  async function reset() {
    setStatus("idea");
    await persist({ status: "idea" });
  }

  async function addNote() {
    if (!body.trim()) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("notes").insert({ idea_id: idea.id, profile_id: myProfileId, body: body.trim() });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setBody("");
  }
  async function removeNote(noteId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    if (error) toast.error(error.message);
  }

  return (
    <div className="space-y-4">
      {/* Want to do + plan */}
      <section className="bg-paper border border-edge rounded-lg p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={toggleStar}
            aria-pressed={starredByMe}
            className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors", starredByMe ? "bg-amber-50 border-amber text-canyon-dark" : "bg-paper border-edge text-ink-muted hover:border-ink-soft")}
          >
            <Star className={cn("h-4 w-4", starredByMe && "fill-amber text-amber")} />
            {starredByMe ? "On the want-to-do list" : "Want to do this"}
          </button>
          {stars.length > 0 && (
            <div className="flex items-center gap-1.5">
              {stars.map((s) => {
                const p = profilesById.get(s.profile_id);
                return p ? <Avatar key={s.profile_id} name={p.name} src={p.avatar_url} color={p.display_color} size="xs" title={`${p.name} wants to do this`} /> : null;
              })}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-edge space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium"><CalendarCheck className="h-4 w-4 text-pine" /> Pin to a day</div>
          <div className="flex flex-wrap gap-2 items-center">
            <Input type="date" value={day} min={minDay} max={maxDay} onChange={(e) => onDayChange(e.target.value)} className="h-10 w-auto" />
            <Select value={block} onValueChange={(v) => onBlockChange(v as TimeBlock)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(TIME_BLOCK_LABEL) as TimeBlock[]).map((b) => <SelectItem key={b} value={b}>{TIME_BLOCK_LABEL[b]}</SelectItem>)}
              </SelectContent>
            </Select>
            {busy && <Loader2 className="h-4 w-4 animate-spin text-ink-soft" />}
          </div>
          {stop && stop.nights > 0 && <p className="text-xs text-ink-soft">{stop.city}: {formatDate(stop.arrival)} – {formatDate(stop.departure)}</p>}
          <div className="flex gap-2">
            {status === "skipped" ? (
              <Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" /> Back to ideas</Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={skip}><Ban className="h-4 w-4" /> Not this trip</Button>
            )}
            <span className="inline-flex items-center text-xs text-ink-muted px-2">
              Status: <span className="font-medium text-ink ml-1 capitalize">{status}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="bg-paper border border-edge rounded-lg p-5 shadow-card space-y-3">
        <h2 className="font-serif text-xl font-semibold">Notes {notes.length > 0 && <span className="text-ink-muted font-normal">({notes.length})</span>}</h2>
        {notes.length === 0 ? (
          <p className="text-sm text-ink-muted">No notes yet — jot anything to coordinate (reservations, timing, what to pack).</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => {
              const author = profilesById.get(n.profile_id);
              return (
                <li key={n.id} className="flex gap-3">
                  {author && <Avatar name={author.name} src={author.avatar_url} color={author.display_color} size="sm" />}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm">{author?.name ?? "Someone"}</span>
                      <span className="text-xs text-ink-soft">{formatDate(n.created_at.slice(0, 10))}</span>
                    </div>
                    <p className="text-sm mt-0.5 whitespace-pre-line text-pretty">{n.body}</p>
                    {n.profile_id === myProfileId && (
                      <button onClick={() => removeNote(n.id)} className="text-xs text-ink-muted hover:text-canyon inline-flex items-center gap-1 mt-1"><Trash2 className="h-3 w-3" /> Delete</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex gap-2 items-start pt-2 border-t border-edge">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={2} placeholder="Add a note…" maxLength={2000} />
          <Button onClick={addNote} disabled={!body.trim() || busy} size="sm" className="mt-1"><Send className="h-4 w-4" /> Post</Button>
        </div>
      </section>
    </div>
  );
}
