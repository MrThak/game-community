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

-- Enable RLS
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- Create policies (Allow everyone to read/write for now as requested "users can post")
create policy "Enable read access for all users" on public.posts for select using (true);
create policy "Enable insert for all users" on public.posts for insert with check (true);

create policy "Enable read access for all users" on public.comments for select using (true);
create policy "Enable insert for all users" on public.comments for insert with check (true);
