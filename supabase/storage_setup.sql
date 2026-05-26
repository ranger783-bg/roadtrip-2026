-- Photo uploads for ideas (camera roll / file picker). Public bucket, image-only, 10 MB. Safe to re-run.
insert into storage.buckets (id, name, public)
values ('idea-photos', 'idea-photos', true)
on conflict (id) do nothing;

update storage.buckets
   set file_size_limit = 10485760,
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
 where id = 'idea-photos';

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='authed upload idea photos') then
    create policy "authed upload idea photos" on storage.objects for insert to authenticated with check (bucket_id = 'idea-photos');
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public read idea photos') then
    create policy "public read idea photos" on storage.objects for select using (bucket_id = 'idea-photos');
  end if;
end $$;
