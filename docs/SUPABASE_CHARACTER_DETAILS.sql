-- Add skill and recommendation columns to characters table
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS normal_attack TEXT,
ADD COLUMN IF NOT EXISTS skill_1 TEXT,
ADD COLUMN IF NOT EXISTS skill_2 TEXT,
ADD COLUMN IF NOT EXISTS passive TEXT,
ADD COLUMN IF NOT EXISTS recommended_set TEXT;

-- Update existing character logic if needed (optional)
-- COMMENT ON COLUMN characters.skill_1 IS 'Skill icon/name for team booking logic later';
