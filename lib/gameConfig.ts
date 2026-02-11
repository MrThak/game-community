export interface GameConfig {
    formationType: 'line_battle' | 'grid_party' | 'simple_list'
    maxSlots: number
    rowConfig?: {
        front: number
        back: number
    }
    features: {
        pets: boolean
        leader: boolean
    }
    labels: {
        front: string
        back: string
        character: string
    }
}

// Default configuration (Simple 5-man party)
export const DEFAULT_GAME_CONFIG: GameConfig = {
    formationType: 'simple_list',
    maxSlots: 5,
    features: {
        pets: false,
        leader: true,
    },
    labels: {
        front: 'Main Team',
        back: 'Sub Team', // Not used in simple_list usually, but good for fallback
        character: 'Character',
    }
}

// Seven Knights (Current Implementation)
export const SEVEN_KNIGHTS_CONFIG: GameConfig = {
    formationType: 'line_battle',
    maxSlots: 10, // 5 front + 5 back
    rowConfig: {
        front: 5,
        back: 5,
    },
    features: {
        pets: true,
        leader: false,
    },
    labels: {
        front: 'Front Row',
        back: 'Back Row',
        character: 'Heroes',
    }
}

// Database Game ID to Config Mapping
// You should update this map with real Game IDs from your Supabase 'games' table
export const GAME_CONFIGS: Record<string, GameConfig> = {
    'default': DEFAULT_GAME_CONFIG,
    // Replace with your actual Game ID for Seven Knights
    '4791945e-20c4-41d5-9738-941f29e25355': SEVEN_KNIGHTS_CONFIG,
}

export function getGameConfig(gameId: string): GameConfig {
    return GAME_CONFIGS[gameId] || DEFAULT_GAME_CONFIG
}
