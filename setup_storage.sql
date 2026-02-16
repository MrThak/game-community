-- 1. Create Storage Bucket 'game_assets'
insert into storage.buckets (id, name, public)
values ('game_assets', 'game_assets', true)
on conflict (id) do nothing;

-- 2. Setup RLS for Storage
-- Allow public access to read files
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'game_assets' );

-- Allow authenticated users (or admins) to upload
-- For now, allowing all users to upload to keep it simple, but you might want to restrict this later.
create policy "Authenticated Export"
  on storage.objects for insert
  with check ( bucket_id = 'game_assets' );

-- Allow users to update/delete their own files (Optional)
create policy "Give full access to own files"
  on storage.objects for all
  using ( bucket_id = 'game_assets' and auth.uid() = owner );
