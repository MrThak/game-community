-- 1. Create 'characters' table
CREATE TABLE IF NOT EXISTS characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    game_id TEXT NOT NULL, -- Link to games(id)
    image_url TEXT,
    description TEXT,
    element TEXT, -- e.g. Fire, Water, Dark
    rarity TEXT, -- e.g. Legendary, Rare
    role TEXT -- e.g. Tank, DPS, Support
);

-- 2. Enable RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Everyone can view
CREATE POLICY "Public characters are viewable by everyone" 
ON characters FOR SELECT USING (true);

-- Only logged in users can add (or restrict to admin later)
CREATE POLICY "Users can insert characters" 
ON characters FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. Create Storage Bucket for Character Images
INSERT INTO storage.buckets (id, name, public) VALUES ('character-images', 'character-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public character images are viewable by everyone" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'character-images' );

CREATE POLICY "Users can upload character images" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'character-images' AND auth.role() = 'authenticated' );
