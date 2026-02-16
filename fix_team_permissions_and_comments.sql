-- 1. Update RLS for seven_knights_teams
-- Enable RLS (already enabled, but good to ensure)
ALTER TABLE public.seven_knights_teams ENABLE ROW LEVEL SECURITY;

-- Policy: Allow Update only for owner
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.seven_knights_teams;
CREATE POLICY "Enable update for users based on user_id"
ON public.seven_knights_teams
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow Delete only for owner
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.seven_knights_teams;
CREATE POLICY "Enable delete for users based on user_id"
ON public.seven_knights_teams
FOR DELETE
USING (auth.uid() = user_id);

-- 2. Create seven_knights_team_comments table
CREATE TABLE IF NOT EXISTS public.seven_knights_team_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id uuid REFERENCES public.seven_knights_teams(id) ON DELETE CASCADE NOT NULL,
    user_id uuid, -- Optional, for logged in users
    username text, -- Display name
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS for Comments
ALTER TABLE public.seven_knights_team_comments ENABLE ROW LEVEL SECURITY;

-- Read: Everyone
DROP POLICY IF EXISTS "Enable read access for all users" ON public.seven_knights_team_comments;
CREATE POLICY "Enable read access for all users" ON public.seven_knights_team_comments FOR SELECT USING (true);

-- Insert: Authenticated users (or all if we allow anon comments, but let's stick to auth for now or all if broad)
-- Let's allow all for now to match other tables, but ideally should be auth.
DROP POLICY IF EXISTS "Enable insert for all users" ON public.seven_knights_team_comments;
CREATE POLICY "Enable insert for all users" ON public.seven_knights_team_comments FOR INSERT WITH CHECK (true);

-- Delete: Owner of comment OR Owner of the team (optional, but let's stick to comment owner first)
DROP POLICY IF EXISTS "Enable delete for own comments" ON public.seven_knights_team_comments;
CREATE POLICY "Enable delete for own comments"
ON public.seven_knights_team_comments
FOR DELETE
USING (auth.uid() = user_id);
