-- 1. Create 'pets' table
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    game_id TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    rarity TEXT -- e.g. Mythic, Legendary, Rare
);

-- 2. Enable RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Public pets are viewable by everyone" 
ON public.pets FOR SELECT USING (true);

CREATE POLICY "Admins can manage pets" 
ON public.pets FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
);

-- 4. Create Storage Bucket for Pet Images
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public pet images are viewable by everyone" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'pet-images' );

CREATE POLICY "Admins can upload pet images" 
ON storage.objects FOR INSERT 
WITH CHECK ( 
    bucket_id = 'pet-images' AND 
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);
