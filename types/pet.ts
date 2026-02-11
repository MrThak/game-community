export interface Pet {
    id: string
    created_at?: string
    name: string
    game_id: string
    image_url?: string
    description?: string
    rarity?: 'Mythic' | 'Legendary' | 'Epic' | 'Rare' | string
}
