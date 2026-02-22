create table if not exists public.equipment (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  game_id uuid references public.games(id) on delete cascade not null,
  name text not null,
  name_en text,
  image_url text,
  description text,
  type text not null,
  rarity text not null,
  stats jsonb,
  special_effect text,
  how_to_obtain text
);

alter table public.equipment enable row level security;

drop policy if exists "Equipment are viewable by everyone." on public.equipment;
create policy "Equipment are viewable by everyone."
  on public.equipment for select
  using ( true );

drop policy if exists "Admins can insert equipment" on public.equipment;
create policy "Admins can insert equipment"
  on public.equipment for insert
  with check ( auth.role() = 'authenticated' );

drop policy if exists "Admins can update equipment" on public.equipment;
create policy "Admins can update equipment"
  on public.equipment for update
  using ( auth.role() = 'authenticated' );

drop policy if exists "Admins can delete equipment" on public.equipment;
create policy "Admins can delete equipment"
  on public.equipment for delete
  using ( auth.role() = 'authenticated' );
