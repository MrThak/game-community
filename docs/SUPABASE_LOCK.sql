-- Lock the database (Make characters Read-Only for everyone)
-- Only Admins (service role or specific user) can edit

-- 1. Characters: Everyone can view, but NO ONE can insert/edit via public API (except Service Role)
DROP POLICY IF EXISTS "Characters are manageable by everyone" ON characters;

CREATE POLICY "Public characters are viewable by everyone" 
ON characters FOR SELECT 
USING (true);

-- 2. Games: Everyone can view, NO ONE can insert via public API
DROP POLICY IF EXISTS "Public games are insertable by everyone" ON games;

CREATE POLICY "Public games are viewable by everyone" 
ON games FOR SELECT 
USING (true);

-- Note: The Service Role (Server-side API) bypasses RLS, so it can always insert/edit.
-- But the Client-side (Browser) is now locked.
