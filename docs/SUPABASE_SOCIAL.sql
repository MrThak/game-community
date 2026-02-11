-- 1. Create 'likes' table
create table if not exists public.likes (
    post_id uuid references public.posts(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (post_id, user_id)
);

-- 2. Enable RLS
alter table public.likes enable row level security;

-- 3. Policies for 'likes' table
create policy "Likes are viewable by everyone" 
on public.likes for select 
using (true);

create policy "Authenticated users can toggle like" 
on public.likes for insert 
with check (auth.uid() = user_id);

create policy "Users can remove their own likes" 
on public.likes for delete 
using (auth.uid() = user_id);

-- 4. Helper function to count likes (optional, but good for performance if needed later)
-- For now we can just use count() in query

-- 5. Updated Policy for Comments (Ensure authenticated users can comment)
-- (Already exists in supabase_schema.sql but good to double check)
-- create policy "Authenticated users can insert comments" on public.comments for insert with check (auth.role() = 'authenticated');
