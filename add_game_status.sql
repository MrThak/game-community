-- Add status column to games table
ALTER TABLE public.games 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Optional: Verify column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'games' 
        AND column_name = 'status'
    ) THEN
        RAISE EXCEPTION 'Column status was not created successfully';
    END IF;
END $$;
