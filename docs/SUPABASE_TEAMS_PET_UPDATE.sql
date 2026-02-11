-- Add pet_image_url to teams table for easier display
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS pet_image_url TEXT;
