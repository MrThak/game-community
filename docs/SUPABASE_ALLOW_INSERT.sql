-- Allow everyone to view, insert, update, delete characters
-- (WARNING: Use this only for development/seeding)

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Characters are manageable by everyone" ON characters;

CREATE POLICY "Characters are manageable by everyone" 
ON characters FOR ALL 
USING (true)
WITH CHECK (true);

-- Also allow inserts into games
CREATE POLICY "Public games are insertable by everyone" 
ON games FOR INSERT 
WITH CHECK (true);
