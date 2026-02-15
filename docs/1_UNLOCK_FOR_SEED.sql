-- =========================================================
-- 🔓 โหมดเติมของ (Unlock)
-- รันอันนี้เมื่อ: ต้องการใช้ Script ดูดข้อมูลอัตโนมัติ (Seed)
-- =========================================================

-- ลบกติกาเดิมทิ้งให้หมด (Clean Slate)
DROP POLICY IF EXISTS "Public characters are viewable by everyone" ON characters;
DROP POLICY IF EXISTS "Characters are manageable by everyone" ON characters;
DROP POLICY IF EXISTS "Only admin (thaksin819) can manage characters" ON characters;

DROP POLICY IF EXISTS "Public games are viewable by everyone" ON games;
DROP POLICY IF EXISTS "Public games are insertable by everyone" ON games;
DROP POLICY IF EXISTS "Only admin (thaksin819) can manage games" ON games;

-- สร้างกติกาใหม่: "เปิดหมดเปลือก" (ทุกคนทำได้ทุกอย่าง)
CREATE POLICY "Everyone can manage characters" 
ON characters FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Everyone can manage games" 
ON games FOR ALL 
USING (true) WITH CHECK (true);
