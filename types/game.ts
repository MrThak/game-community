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
        }
    }
    created_at: string
}
