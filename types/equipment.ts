export interface Equipment {
    id: string
    created_at?: string
    game_id: string

    // Basic Info
    name: string
    name_en?: string
    image_url?: string
    description?: string

    // Classification
    type: 'Weapon' | 'Armor' | 'Accessory' | 'อาวุธ' | 'ชุดเกราะ' | 'เครื่องประดับ' | string
    rarity: 'ตำนาน (Legendary)' | 'หายาก (Rare)' | 'ระดับสูง (High)' | 'ทั่วไป (Normal)' | string

    // Stats & Effects
    stats?: {
        hp?: number
        atk?: number
        def?: number
        [key: string]: any // allow other dynamic stats
    }
    special_effect?: string

    // Acquisition
    how_to_obtain?: string
}
