export interface Character {
    id: string
    created_at?: string
    name: string
    game_id: string
    image_url?: string
    description?: string
    role?: 'Tank' | 'DPS' | 'Support' | 'Magic' | 'Attack' | 'Defense' | 'Balanced' | 'โจมตี' | 'เวท' | 'ป้องกัน' | 'สนับสนุน' | 'สมดุล' | string

    // Skill Info
    normal_attack?: string
    skill_1?: string
    skill_2?: string
    passive?: string

    // Recommendations
    recommended_set?: string
    recommended_stages?: string[]
}
