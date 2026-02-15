-- ล็อค Characters ให้มั่นใจว่ามีแค่ "thaksin819@gmail.com" แก้ได้
-- ส่วนคนอื่น (รวมถึงแขกที่ไม่ได้ login) ดูได้อย่างเดียว

-- 1. ล้าง Policy เก่าๆ ทิ้งก่อน (เพื่อความชัวร์)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Characters are manageable by everyone" ON characters;
DROP POLICY IF EXISTS "Public characters are viewable by everyone" ON characters;
DROP POLICY IF EXISTS "Users can insert characters" ON characters;
DROP POLICY IF EXISTS "Only admin can manage characters" ON characters;

-- 2. อนุญาตให้ "ทุกคน" (Public) "ดู" ได้อย่างเดียว
CREATE POLICY "Public characters are viewable by everyone" 
ON characters FOR SELECT 
USING (true);

-- 3. อนุญาตให้ "thaksin819@gmail.com" เท่านั้น ที่ เพิ่ม/ลบ/แก้ไข ได้
CREATE POLICY "Only admin (thaksin819) can insert characters" 
ON characters FOR INSERT 
TO authenticated 
WITH CHECK (auth.jwt() ->> 'email' = 'thaksin819@gmail.com');

CREATE POLICY "Only admin (thaksin819) can update characters" 
ON characters FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'thaksin819@gmail.com');

CREATE POLICY "Only admin (thaksin819) can delete characters" 
ON characters FOR DELETE 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'thaksin819@gmail.com');

-- (Optional) ทำแบบเดียวกันกับ Table 'games' ถ้าต้องการ
DROP POLICY IF EXISTS "Public games are insertable by everyone" ON games;
CREATE POLICY "Public games are viewable by everyone" 
ON games FOR SELECT USING (true);

CREATE POLICY "Only admin (thaksin819) can manage games" 
ON games FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'thaksin819@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'thaksin819@gmail.com');
