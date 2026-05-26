export type StopType = "main" | "overnight" | "endpoint";

export type IdeaCategory =
  | "scenic_drive"
  | "sight"
  | "town"
  | "food"
  | "grocery"
  | "fuel"
  | "hike"
  | "water"
  | "wildlife"
  | "forest_road"
  | "rest";

export type DogOk = "yes" | "no" | "maybe";
export type IdeaStatus = "idea" | "planned" | "skipped";
export type TimeBlock = "morning" | "afternoon" | "evening" | "all_day";

export interface ProfileRow {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  name: string;
  avatar_url: string | null;
  display_color: string;
  created_at: string;
}

export interface IdeaRow {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  stop_id: string | null;
  address: string | null;
  map_query: string | null;
  cost_low: number | null;
  cost_high: number | null;
  dog_ok: DogOk;
  in_town: boolean;
  low_walking: boolean;
  indoor: boolean;
  external_link: string | null;
  photo_url: string | null;
  status: IdeaStatus;
  pinned_day: string | null;
  time_block: TimeBlock;
  added_by: string | null;
  created_at: string;
}

export interface StarRow {
  profile_id: string;
  idea_id: string;
  created_at: string;
}

export interface NoteRow {
  id: string;
  idea_id: string;
  profile_id: string;
  body: string;
  created_at: string;
}

/** Fixed route stop (lives in constants + seeded to the `stops` table). */
export interface Stop {
  id: string;
  seq: number;
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  arrival: string; // yyyy-mm-dd
  departure: string; // yyyy-mm-dd
  nights: number;
  type: StopType;
  color: string;
  blurb: string;
}
