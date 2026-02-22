export interface Game {
    id: string
    name: string
    slug: string
    icon_url: string
    metadata?: {
        tables?: {
            characters?: string
            pets?: string
            teams?: string
            equipment?: string
        }
    }
    status?: 'active' | 'coming_soon' | string
    created_at: string
}
