-- Add missing columns to 'posts' table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS username text;

-- Add missing columns to 'comments' table
ALTER TABLE comments ADD COLUMN IF NOT EXISTS username text;

-- Force schema cache reload (usually automatic, but acts as a check)
NOTIFY pgrst, 'reload config';
