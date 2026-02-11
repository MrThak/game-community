export interface Character {
    id: string
    created_at?: string
    name: string
    game_id: string
    image_url?: string
    description?: string
    element?: 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Dark' | 'Light' | 'Magic' | string
    rarity?: 'Legendary' | 'Epic' | 'Rare' | 'Common' | string
    role?: 'Tank' | 'DPS' | 'Support' | 'Magic' | string

    // Skill Info
    normal_attack?: string
    skill_1?: string
    skill_2?: string
    passive?: string

    // Recommendations
    recommended_set?: string
}
