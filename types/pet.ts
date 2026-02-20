export interface Pet {
    id: string
    created_at?: string
    name: string
    game_id: string
    image_url?: string
    description?: string
    rarity?: 'ตำนาน (Legendary)' | 'หายาก (Rare)' | 'ระดับสูง (High)' | 'ทั่วไป (Normal)' | 'Mythic' | 'Legendary' | 'Epic' | 'Rare' | string
}
