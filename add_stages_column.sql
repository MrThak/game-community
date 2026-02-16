-- Add recommended_stages column to Seven Knights Characters
-- We use JSONB to store an array of strings e.g. ["Arena", "Raid"]
ALTER TABLE public.seven_knights_characters 
ADD COLUMN IF NOT EXISTS recommended_stages jsonb default '[]'::jsonb;
