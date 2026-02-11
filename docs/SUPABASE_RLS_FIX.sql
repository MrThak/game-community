-- 1. Create Tables (if they don't exist)
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT,
    content TEXT,
    image_url TEXT,
    game_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    username TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    username TEXT
);

-- 2. Enable RLS on tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

DROP POLICY IF EXISTS "Public comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON comments;

-- 4. Create Policies for 'posts'
-- Allow everyone to view posts
CREATE POLICY "Public posts are viewable by everyone" 
ON posts FOR SELECT 
USING (true);

-- Allow authenticated users to insert posts
CREATE POLICY "Users can insert their own posts" 
ON posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update/delete their own posts
CREATE POLICY "Users can update their own posts" 
ON posts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON posts FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Create Policies for 'comments'
-- Allow everyone to view comments
CREATE POLICY "Public comments are viewable by everyone" 
ON comments FOR SELECT 
USING (true);

-- Allow authenticated users to insert comments
CREATE POLICY "Users can insert their own comments" 
ON comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);
