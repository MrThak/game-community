-- Run this in Supabase SQL Editor to fix the missing table error

-- 1. Create Seven Knights Characters Table
create table if not exists public.seven_knights_characters (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  image_url text,
  name text not null,
  rarity text,
  role text,
  normal_attack text,
  skill_1 text,
  skill_2 text,
  passive text,
  recommended_set text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Seven Knights Pets Table
create table if not exists public.seven_knights_pets (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  name text not null,
  rarity text,
  image_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Seven Knights Teams Table
create table if not exists public.seven_knights_teams (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  user_id uuid,
  username text,
  name text not null,
  mode text,
  formation jsonb,
  pet_id uuid references public.seven_knights_pets(id) on delete set null,
  pet_image_url text,
  total_power integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS
alter table public.seven_knights_characters enable row level security;
alter table public.seven_knights_pets enable row level security;
alter table public.seven_knights_teams enable row level security;

-- 5. Open Permissions (For development/testing)
create policy "Enable read access for all users" on public.seven_knights_characters for select using (true);
create policy "Enable insert for all users" on public.seven_knights_characters for insert with check (true);
create policy "Enable update for all users" on public.seven_knights_characters for update using (true);
create policy "Enable delete for all users" on public.seven_knights_characters for delete using (true);

create policy "Enable read access for all users" on public.seven_knights_pets for select using (true);
create policy "Enable insert for all users" on public.seven_knights_pets for insert with check (true);
create policy "Enable update for all users" on public.seven_knights_pets for update using (true);
create policy "Enable delete for all users" on public.seven_knights_pets for delete using (true);

create policy "Enable read access for all users" on public.seven_knights_teams for select using (true);
create policy "Enable insert for all users" on public.seven_knights_teams for insert with check (true); 
