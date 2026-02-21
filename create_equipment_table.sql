-- Create a table for game equipment/accessories
create table if not exists public.equipment (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  game_id uuid references public.games(id) on delete cascade not null,
  
  -- Basic Info
  name text not null,
  name_en text,
  image_url text,
  description text,
  
  -- Classification
  type text not null, -- 'Weapon', 'Armor', 'Accessory'
  rarity text not null, -- 'ตำนาน (Legendary)', 'หายาก (Rare)', 'ระดับสูง (High)', 'ทั่วไป (Normal)'
  
  -- Stats & Effects
  stats jsonb, -- Flexible JSON for raw stats (HP, ATK, DEF)
  special_effect text, -- For accessories like Ring of Immortality
  
  -- Acquisition
  how_to_obtain text
);

-- Set up Row Level Security (RLS)
alter table public.equipment enable row level security;

-- Policies
create policy "Equipment are viewable by everyone."
  on equipment for select
  using ( true );

-- Only admins can insert/update/delete (handled via application logic or specific admin role)
create policy "Admins can insert equipment"
  on equipment for insert
  with check ( auth.role() = 'authenticated' ); -- Simplified for now, restrict in app

create policy "Admins can update equipment"
  on equipment for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete equipment"
  on equipment for delete
  using ( auth.role() = 'authenticated' );
