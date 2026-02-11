-- 1. Create 'teams' table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    game_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    username TEXT, -- Cache username for display
    
    mode TEXT NOT NULL CHECK (mode IN ('Arena', 'GuildWar', 'Adventure', 'Other')),
    
    -- Formation Data (JSONB)
    -- Structure: { "front": ["char_id", ...], "back": ["char_id", ...] }
    formation JSONB DEFAULT '{"front": [], "back": []}'::jsonb,
    
    pet_id UUID, -- Optional link to a 'pets' table if we have one, or just store ID for now
    
    -- Stats snapshot (Optional, for easy display)
    total_power INTEGER DEFAULT 0
);

-- 2. Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Everyone can view
CREATE POLICY "Public teams are viewable by everyone" 
ON teams FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Users can insert their own teams" 
ON teams FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Owners can update
CREATE POLICY "Users can update their own teams" 
ON teams FOR UPDATE 
USING (auth.uid() = user_id);

-- Owners can delete
CREATE POLICY "Users can delete their own teams" 
ON teams FOR DELETE 
USING (auth.uid() = user_id);
