"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhotoPicker } from "@/components/photo-picker";
import { CATEGORIES, STOPS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { IdeaCategory, DogOk } from "@/lib/types";

const CAT_KEYS = Object.keys(CATEGORIES) as IdeaCategory[];

export function AddForm({ myProfileId, myName }: { myProfileId: string; myName: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IdeaCategory>("sight");
  const [stopId, setStopId] = useState<string>("");
  const [dogOk, setDogOk] = useState<DogOk>("maybe");
  const [inTown, setInTown] = useState(false);
  const [lowWalking, setLowWalking] = useState(false);
  const [indoor, setIndoor] = useState(false);
  const [costLow, setCostLow] = useState("");
  const [costHigh, setCostHigh] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [mapQuery, setMapQuery] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Give it a title.");
      return;
    }
    setPending(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("ideas")
      .insert({
        title: title.trim(),
        description: description.trim(),
        category,
        stop_id: stopId || null,
        dog_ok: dogOk,
        in_town: inTown,
        low_walking: lowWalking,
        indoor,
        cost_low: costLow ? Number(costLow) : null,
        cost_high: costHigh ? Number(costHigh) : null,
        external_link: externalLink.trim() || null,
        photo_url: photoUrl.trim() || null,
        map_query: mapQuery.trim() || null,
        status: "idea",
        added_by: myProfileId,
      })
      .select()
      .single();
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Added to the board.");
    router.push(data ? `/ideas/${data.id}` : "/");
  }

  return (
    <form onSubmit={onSubmit} className="bg-paper border border-edge rounded-lg p-5 md:p-6 shadow-card space-y-5">
      <p className="text-xs text-ink-muted">Adding as <span className="font-medium text-ink">{myName}</span></p>

      <Field label="Title" required><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What is it?" maxLength={120} required /></Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Near which stop?">
          <Select value={stopId} onValueChange={setStopId}>
            <SelectTrigger><SelectValue placeholder="Pick a stop" /></SelectTrigger>
            <SelectContent>
              {STOPS.filter((s) => s.type !== "endpoint").map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.city}, {s.state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Category">
          <Select value={category} onValueChange={(v) => setCategory(v as IdeaCategory)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CAT_KEYS.map((c) => <SelectItem key={c} value={c}>{CATEGORIES[c]}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Description"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={2000} placeholder="What is it, and why it works for you two (and Tucker)." /></Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Dog-friendly?">
          <Select value={dogOk} onValueChange={(v) => setDogOk(v as DogOk)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="maybe">Maybe / car only</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={inTown} onCheckedChange={(c) => setInTown(!!c)} /><span className="text-sm">In town / easy access</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={lowWalking} onCheckedChange={(c) => setLowWalking(!!c)} /><span className="text-sm">Low walking</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={indoor} onCheckedChange={(c) => setIndoor(!!c)} /><span className="text-sm">Indoor / weather backup</span></label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Cost from ($)"><Input type="number" min="0" value={costLow} onChange={(e) => setCostLow(e.target.value)} /></Field>
        <Field label="Cost to ($)"><Input type="number" min="0" value={costHigh} onChange={(e) => setCostHigh(e.target.value)} /></Field>
        <Field label="Link"><Input type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://" /></Field>
      </div>

      <Field label="Photo" hint="Optional — paste a URL or upload from your phone.">
        <PhotoPicker value={photoUrl} onChange={setPhotoUrl} />
      </Field>

      <Field label="Map location" hint="Optional — a place name/address so the map centers right. Defaults to the title + stop.">
        <Input value={mapQuery} onChange={(e) => setMapQuery(e.target.value)} placeholder="e.g. Two Medicine, Glacier National Park" maxLength={160} />
      </Field>

      <div className="flex justify-end pt-2 border-t border-edge">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {pending ? "Adding…" : "Add to board"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-canyon ml-0.5">*</span>}</Label>
      {children}
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
