-- 1. FORCE FIX Metadata (using robust JSON functions)
UPDATE public.games
SET metadata = jsonb_build_object(
    'tables', jsonb_build_object(
        'characters', 'seven_knights_characters',
        'pets', 'seven_knights_pets',
        'teams', 'seven_knights_teams'
    )
)
WHERE name ILIKE '%Rebirth%';

-- 2. VERIFY Metadata (Check the results!)
SELECT 
    name, 
    metadata->'tables'->>'characters' as "Check This Column -> Should be seven_knights_characters",
    metadata->'tables'->>'pets' as "Pet Table"
FROM public.games 
WHERE name ILIKE '%Rebirth%';

-- 3. VERIFY Table Exists in Database
SELECT 
    schemaname, 
    tablename, 
    tableowner 
FROM pg_tables 
WHERE tablename = 'seven_knights_characters';

-- 4. VERIFY Admin (Check if your email is in the list)
SELECT 
    a.id, 
    u.email, 
    a.created_at 
FROM public.admins a
JOIN auth.users u ON a.user_id = u.id;
