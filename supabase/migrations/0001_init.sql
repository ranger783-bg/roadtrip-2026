-- Road trip 2026 schema: profiles, fixed stops, ideas, stars, notes.
set search_path = public;

create type idea_category as enum
  ('scenic_drive','sight','town','food','grocery','fuel','hike','water','wildlife','forest_road','rest');
create type dog_ok as enum ('yes','no','maybe');
create type idea_status as enum ('idea','planned','skipped');
create type time_block as enum ('morning','afternoon','evening','all_day');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text unique,
  name text not null,
  display_color text not null default '#b5552f',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Fixed route stops (campgrounds). Seeded once; mirrors src/lib/constants.ts STOPS.
create table stops (
  id text primary key,
  seq integer not null,
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  lat double precision not null,
  lng double precision not null,
  arrival date not null,
  departure date not null,
  nights integer not null default 0,
  type text not null default 'overnight',
  color text not null default '#b8ad99',
  blurb text
);

create table ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category idea_category not null default 'sight',
  stop_id text references stops(id) on delete set null,
  address text,
  map_query text,
  cost_low integer,
  cost_high integer,
  dog_ok dog_ok not null default 'maybe',
  in_town boolean not null default false,
  low_walking boolean not null default false,
  indoor boolean not null default false,
  external_link text,
  photo_url text,
  status idea_status not null default 'idea',
  pinned_day date,
  time_block time_block not null default 'all_day',
  added_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index ideas_stop_idx on ideas(stop_id);
create index ideas_pinned_idx on ideas(pinned_day);

create table stars (
  profile_id uuid not null references profiles(id) on delete cascade,
  idea_id uuid not null references ideas(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, idea_id)
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  body text not null check (length(trim(body)) > 0 and length(body) <= 2000),
  created_at timestamptz not null default now()
);
create index notes_idea_idx on notes(idea_id, created_at);

-- ---------- helpers ----------
create or replace function public.my_profile_id() returns uuid
  language sql stable security definer set search_path = public
as $$ select id from public.profiles where auth_user_id = auth.uid() limit 1; $$;

create or replace function public.handle_new_auth_user() returns trigger
  language plpgsql security definer set search_path = public
as $$
begin
  update public.profiles set auth_user_id = new.id
   where email = new.email and auth_user_id is null;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_auth_user();

-- ---------- RLS ----------
alter table profiles enable row level security;
alter table stops enable row level security;
alter table ideas enable row level security;
alter table stars enable row level security;
alter table notes enable row level security;

create policy "profiles read" on profiles for select using (auth.role() = 'authenticated');
create policy "profiles update own" on profiles for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());

create policy "stops read" on stops for select using (auth.role() = 'authenticated');

create policy "ideas read" on ideas for select using (auth.role() = 'authenticated');
create policy "ideas insert" on ideas for insert with check (auth.role() = 'authenticated' and added_by = public.my_profile_id());
create policy "ideas update" on ideas for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "ideas delete own" on ideas for delete using (added_by = public.my_profile_id());

create policy "stars read" on stars for select using (auth.role() = 'authenticated');
create policy "stars insert own" on stars for insert with check (profile_id = public.my_profile_id());
create policy "stars delete own" on stars for delete using (profile_id = public.my_profile_id());

create policy "notes read" on notes for select using (auth.role() = 'authenticated');
create policy "notes insert own" on notes for insert with check (profile_id = public.my_profile_id());
create policy "notes delete own" on notes for delete using (profile_id = public.my_profile_id());

-- ---------- realtime ----------
alter publication supabase_realtime add table ideas;
alter publication supabase_realtime add table stars;
alter publication supabase_realtime add table notes;
