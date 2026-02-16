-- 1. Force Setup Metadata for Seven Knights Rebirth
UPDATE public.games
SET metadata = '{
  "tables": {
    "characters": "seven_knights_characters",
    "pets": "seven_knights_pets",
    "teams": "seven_knights_teams"
  }
}'::jsonb
WHERE name ILIKE '%Rebirth%';

-- 2. Add your user as Admin (Optional - Replace with your User ID if needed)
-- INSERT INTO public.admins (user_id) VALUES ('your-user-id-here') ON CONFLICT DO NOTHING;

-- 3. Verify Metadata
SELECT name, metadata FROM public.games WHERE name ILIKE '%Rebirth%';
