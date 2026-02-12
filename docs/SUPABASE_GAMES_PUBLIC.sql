-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow public read access (SELECT)
CREATE POLICY "Public games are viewable by everyone" 
ON games FOR SELECT 
USING (true);
