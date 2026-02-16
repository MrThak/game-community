-- 1. Rename old tables (Backup instead of delete for safety)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'characters') THEN
    ALTER TABLE public.characters RENAME TO characters_old_backup;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pets') THEN
    ALTER TABLE public.pets RENAME TO pets_old_backup;
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'teams') THEN
    ALTER TABLE public.teams RENAME TO teams_old_backup;
  END IF;
END $$;

-- 2. Ensure new tables exist (Re-run creation just in case)
-- Seven Knights Characters
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

-- 3. Enable RLS and Policies (Idempotent)
alter table public.seven_knights_characters enable row level security;
alter table public.seven_knights_pets enable row level security;
alter table public.seven_knights_teams enable row level security;

DO $$
BEGIN
    -- Characters Policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_characters' AND policyname = 'Enable read access for all users') THEN
        create policy "Enable read access for all users" on public.seven_knights_characters for select using (true);
    END IF;
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_characters' AND policyname = 'Enable insert for all users') THEN
        create policy "Enable insert for all users" on public.seven_knights_characters for insert with check (true);
    END IF;
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_characters' AND policyname = 'Enable update for all users') THEN
        create policy "Enable update for all users" on public.seven_knights_characters for update using (true);
    END IF;
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_characters' AND policyname = 'Enable delete for all users') THEN
        create policy "Enable delete for all users" on public.seven_knights_characters for delete using (true);
    END IF;

    -- Pets Policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_pets' AND policyname = 'Enable read access for all users') THEN
        create policy "Enable read access for all users" on public.seven_knights_pets for select using (true);
    END IF;
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_pets' AND policyname = 'Enable insert for all users') THEN
        create policy "Enable insert for all users" on public.seven_knights_pets for insert with check (true);
    END IF;
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_pets' AND policyname = 'Enable update for all users') THEN
        create policy "Enable update for all users" on public.seven_knights_pets for update using (true);
    END IF;
     IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_pets' AND policyname = 'Enable delete for all users') THEN
        create policy "Enable delete for all users" on public.seven_knights_pets for delete using (true);
    END IF;

    -- Teams Policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_teams' AND policyname = 'Enable read access for all users') THEN
        create policy "Enable read access for all users" on public.seven_knights_teams for select using (true);
    END IF;
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'seven_knights_teams' AND policyname = 'Enable insert for all users') THEN
        create policy "Enable insert for all users" on public.seven_knights_teams for insert with check (true);
    END IF;
END $$;
