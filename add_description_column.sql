-- Add missing columns to seven_knights_characters table
ALTER TABLE public.seven_knights_characters 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS recommended_stages text[],
ADD COLUMN IF NOT EXISTS name_en text;

-- Optional: Verify columns exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'seven_knights_characters' 
        AND column_name = 'description'
    ) THEN
        RAISE EXCEPTION 'Column description was not created successfully';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'seven_knights_characters' 
        AND column_name = 'recommended_stages'
    ) THEN
        RAISE EXCEPTION 'Column recommended_stages was not created successfully';
    END IF;
END $$;
