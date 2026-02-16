-- Create games table (Registry)
create table if not exists public.games (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text unique not null,
  slug text unique not null,
  icon_url text,
  metadata jsonb default '{}'::jsonb -- Stores config like { "tables": { "characters": "seven_knights_characters" } }
);

-- Enable RLS for games
alter table public.games enable row level security;
create policy "Enable read access for all users" on public.games for select using (true);
-- (Optional) Policy for admin insert/update would go here

-- Create posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  game_id uuid references public.games(id) on delete cascade not null,
  user_id uuid, -- Optional: links to auth.users if logged in or null for guest
  username text -- Optional: for guest/user display name
);

-- Create comments table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid,
  username text
);

-- Enable RLS for community tables
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- Create policies (Allow everyone to read/write for now as requested "users can post")
create policy "Enable read access for all users" on public.posts for select using (true);
create policy "Enable insert for all users" on public.posts for insert with check (true);

create policy "Enable read access for all users" on public.comments for select using (true);
create policy "Enable insert for all users" on public.comments for insert with check (true);

-- ==========================================
-- Game Specific Tables: Seven Knights
-- ==========================================

-- Seven Knights Characters
create table if not exists public.seven_knights_characters (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  image_url text,
  name text not null,
  rarity text,
  role text, -- 'โจมตี', 'เวท', 'ป้องกัน', 'สนับสนุน', 'สมดุล'
  normal_attack text,
  skill_1 text,
  skill_2 text,
  passive text,
  recommended_set text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seven Knights Pets
create table if not exists public.seven_knights_pets (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  name text not null,
  rarity text,
  image_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seven Knights Teams
create table if not exists public.seven_knights_teams (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references public.games(id) on delete cascade not null,
  user_id uuid, -- Optional or references auth.users
  username text,
  name text not null,
  mode text, -- 'Arena', 'GuildWar'
  formation jsonb, -- Stores array/object of character IDs/Positions
  pet_id uuid references public.seven_knights_pets(id) on delete set null,
  pet_image_url text,
  total_power integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Seven Knights Tables
alter table public.seven_knights_characters enable row level security;
alter table public.seven_knights_pets enable row level security;
alter table public.seven_knights_teams enable row level security;

-- Public read access for game data
create policy "Enable read access for all users" on public.seven_knights_characters for select using (true);
create policy "Enable read access for all users" on public.seven_knights_pets for select using (true);
create policy "Enable read access for all users" on public.seven_knights_teams for select using (true);

-- Allow authenticated users (or all users if open) to create teams
create policy "Enable insert for all users" on public.seven_knights_teams for insert with check (true);
-- Note: You might want to restrict character/pet insertion to admins in production
create policy "Enable insert for all users" on public.seven_knights_characters for insert with check (true);
create policy "Enable insert for all users" on public.seven_knights_pets for insert with check (true);
