import { requireSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ItineraryView } from "./itinerary-view";
import type { IdeaRow } from "@/lib/types";

export const metadata = { title: "Itinerary · Summer 2026 Road Trip" };

export default async function ItineraryPage() {
  await requireSession();
  const supabase = await createClient();
  const { data: ideas } = await supabase
    .from("ideas")
    .select("*")
    .not("pinned_day", "is", null)
    .neq("status", "skipped")
    .order("pinned_day");
  return <ItineraryView pinned={(ideas ?? []) as IdeaRow[]} />;
}
