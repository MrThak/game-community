-- =========================================================
-- 🔒 โหมดปลอดภัย (Secure Lock) - ฉบับแก้ปัญหา "ชื่อซ้ำ"
-- รันอันนี้เมื่อ: เติมของเสร็จแล้ว (กลับสู่สภาวะปกติ)
-- =========================================================

-- 1. ล้าง Policy เก่าๆ ทิ้งให้เกลี้ยง (รวมทุกชื่อที่เคยตั้งมา)
DROP POLICY IF EXISTS "Everyone can manage characters" ON characters;
DROP POLICY IF EXISTS "Characters are manageable by everyone" ON characters;
DROP POLICY IF EXISTS "Public characters are viewable by everyone" ON characters;
DROP POLICY IF EXISTS "Users can insert characters" ON characters;
DROP POLICY IF EXISTS "Only admin (thaksin819) can manage characters" ON characters;

DROP POLICY IF EXISTS "Everyone can manage games" ON games;
DROP POLICY IF EXISTS "Public games are insertable by everyone" ON games;
DROP POLICY IF EXISTS "Public games are viewable by everyone" ON games;
DROP POLICY IF EXISTS "Only admin (thaksin819) can manage games" ON games;

-- 2. สร้างกติกาใหม่: "คนทั่วไปดูได้อย่างเดียว"
CREATE POLICY "Public characters are viewable by everyone" 
ON characters FOR SELECT 
USING (true);

CREATE POLICY "Public games are viewable by everyone" 
ON games FOR SELECT 
USING (true);

-- 3. สร้างกติกาพิเศษ: "เฉพาะแอดมิน (คุณ) แก้ไขได้"
-- (เปลี่ยนอีเมลตรงนี้ถ้าต้องการเปลี่ยนแอดมิน)
CREATE POLICY "Only admin (thaksin819) can manage characters" 
ON characters FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'thaksin819@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'thaksin819@gmail.com');

CREATE POLICY "Only admin (thaksin819) can manage games" 
ON games FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'thaksin819@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'thaksin819@gmail.com');
