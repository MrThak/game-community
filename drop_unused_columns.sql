-- Remove Rarity and Element (if exists) columns from Seven Knights Characters
ALTER TABLE public.seven_knights_characters 
DROP COLUMN IF EXISTS rarity,
DROP COLUMN IF EXISTS element;

-- Remove Rarity from Pets if needed (User didn't specify pets but assuming consistency?)
-- User said "Remove Element and Rarity" in context of Character Form.
-- Leaving pets for now unless requested.

-- Update Metadata or other things? No, metadata just maps tables.
