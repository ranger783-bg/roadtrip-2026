import { requireSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { IdeasClient } from "./ideas-client";
import type { IdeaRow, StarRow } from "@/lib/types";

export const metadata = { title: "Ideas · Summer 2026 Road Trip" };

export default async function IdeasPage() {
  const session = await requireSession();
  const supabase = await createClient();
  const [{ data: ideas }, { data: stars }] = await Promise.all([
    supabase.from("ideas").select("*").order("created_at"),
    supabase.from("stars").select("*"),
  ]);

  return (
    <IdeasClient
      initialIdeas={(ideas ?? []) as IdeaRow[]}
      initialStars={(stars ?? []) as StarRow[]}
      myProfileId={session.me.id}
    />
  );
}
