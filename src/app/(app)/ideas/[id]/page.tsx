import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Dog, Building2, Footprints, House, ShoppingCart, Fuel, Flame, Trash2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/placeholder-image";
import { MapEmbed } from "@/components/map-embed";
import { IdeaDetail } from "./idea-detail";
import { requireSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, DOG_LABEL, STOPS_BY_ID, mapQueryForIdea, essentialsLinks } from "@/lib/constants";
import { formatCost } from "@/lib/utils";
import type { IdeaRow, NoteRow, ProfileRow, StarRow } from "@/lib/types";

const ESSENTIAL_ICONS = [ShoppingCart, Fuel, Flame, Trash2, Stethoscope];

export default async function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: idea }, { data: profiles }, { data: stars }, { data: notes }] = await Promise.all([
    supabase.from("ideas").select("*").eq("id", id).single(),
    supabase.from("profiles").select("*"),
    supabase.from("stars").select("*").eq("idea_id", id),
    supabase.from("notes").select("*").eq("idea_id", id).order("created_at"),
  ]);
  if (!idea) notFound();
  const i = idea as IdeaRow;
  const stop = i.stop_id ? STOPS_BY_ID[i.stop_id] ?? null : null;
  const essentials = stop ? essentialsLinks(stop) : [];

  return (
    <div className="container-prose py-4 md:py-8 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-4"><ArrowLeft className="h-4 w-4" /> Back to ideas</Link>

      <article className="space-y-6">
        <div className="relative h-56 md:h-72 rounded-lg overflow-hidden border border-edge">
          <PlaceholderImage category={i.category} src={i.photo_url} alt={i.title} />
        </div>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {stop && <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-paper" style={{ background: stop.color }}><MapPin className="h-3 w-3" /> {stop.name}</span>}
            <Badge variant="outline">{CATEGORIES[i.category]}</Badge>
            <Badge variant={i.dog_ok === "yes" ? "pine" : "neutral"}><Dog className="h-3 w-3" /> {DOG_LABEL[i.dog_ok]}</Badge>
            {i.in_town && <Badge variant="sky"><Building2 className="h-3 w-3" /> In town</Badge>}
            {i.low_walking && <Badge variant="neutral"><Footprints className="h-3 w-3" /> Low walking</Badge>}
            {i.indoor && <Badge variant="neutral"><House className="h-3 w-3" /> Indoor</Badge>}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-balance leading-tight">{i.title}</h1>
          <p className="text-sm text-ink-muted">{formatCost(i.cost_low, i.cost_high)}</p>
        </header>

        {i.description && <p className="text-lg leading-relaxed text-pretty whitespace-pre-line">{i.description}</p>}

        {i.external_link && (
          <Button variant="secondary" asChild>
            <a href={i.external_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> More info</a>
          </Button>
        )}

        <IdeaDetail
          idea={i}
          stop={stop}
          initialStars={(stars ?? []) as StarRow[]}
          initialNotes={(notes ?? []) as NoteRow[]}
          profiles={(profiles ?? []) as ProfileRow[]}
          myProfileId={session.me.id}
        />

        <MapEmbed query={mapQueryForIdea(i)} title={i.title} />

        {essentials.length > 0 && (
          <section className="bg-paper border border-edge rounded-lg p-5 shadow-card">
            <h2 className="font-serif text-xl font-semibold mb-1">Essentials near {stop!.city}</h2>
            <p className="text-sm text-ink-muted mb-3">One-tap Google Maps searches for the practical stuff.</p>
            <div className="flex flex-wrap gap-2">
              {essentials.map((e, idx) => {
                const Icon = ESSENTIAL_ICONS[idx] ?? ShoppingCart;
                return (
                  <a key={e.label} href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-sand-soft px-3 py-1.5 text-sm font-medium hover:border-ink-soft">
                    <Icon className="h-4 w-4 text-pine" /> {e.label}
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
