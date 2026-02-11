-- 1. Create 'admins' table
CREATE TABLE IF NOT EXISTS admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3. Policies for admins table
-- Only admins can see who is an admin (or maybe public if needed, but safer to restrict)
-- For simplicity, let's allow authenticated users to read to check their own status
CREATE POLICY "Admins are viewable by authenticated users" 
ON admins FOR SELECT 
USING (auth.role() = 'authenticated');

-- Only super_admins (service_role) or potential bootstrap logic can insert
-- For now, manual insertion via Dashboard is expected.

-- 4. Update 'characters' policies to restrict modifications to admins
-- First, drop old policy if exists
DROP POLICY IF EXISTS "Users can insert characters" ON characters;

-- Insert Policy
CREATE POLICY "Only admins can insert characters" 
ON characters FOR INSERT 
WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Update Policy
CREATE POLICY "Only admins can update characters" 
ON characters FOR UPDATE 
USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Delete Policy
CREATE POLICY "Only admins can delete characters" 
ON characters FOR DELETE 
USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- 5. Helper function to check if user is admin (Optional, but useful for RLS)
-- CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
--   SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
-- $$ LANGUAGE sql SECURITY DEFINER;


-- =====================================================================================
-- 🚨 ขั้นตอนสำคัญ: การเพิ่มตัวเองเป็น Admin (Self-Setup) 🚨
-- 1. ไปที่ Supabase Dashboard -> Authentication -> Users
-- 2. หาอีเมลของคุณ แล้ว copy "User UID" (เช่น '123e4567-e89b-12d3-a456-426614174000')
-- 3. รันคำสั่งนี้ใน SQL Editor (แทนที่ YOUR_USER_ID ด้วย UID ของคุณ):

-- INSERT INTO admins (user_id) VALUES ('YOUR_USER_ID_HERE');

-- ตัวอย่าง:
-- INSERT INTO admins (user_id) VALUES ('d0263300-4d40-4240-a38f-51475c742c0c');
-- =====================================================================================
