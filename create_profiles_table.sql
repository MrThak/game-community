-- 🚨 RE-RUN THIS SCRIPT TO FIX THE COLUMN ERROR
-- We drop the table first to ensure a clean slate (since the previous version had the wrong column name)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  display_name text, -- Changed from full_name to match code
  avatar_url text,
  website text,

  constraint username_length check (char_length(display_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
-- Drop trigger if exists to avoid duplication errors during re-runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
