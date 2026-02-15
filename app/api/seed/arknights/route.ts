import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const GAME_DATA = {
    name: 'Arknights: Endfield',
    slug: 'arknights-endfield',
    icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Arknights_Endfield_logo.png/220px-Arknights_Endfield_logo.png'
};

const CHARACTERS = [
    // 6-Star
    { name: 'Endministrator', rarity: '6', element: 'Unknown', role: 'Guard', image_url: 'https://static.wikia.nocookie.net/arknights/images/6/6a/Endministrator.png' },
    { name: 'Perlica', rarity: '5', element: 'Unknown', role: 'Caster', image_url: 'https://static.wikia.nocookie.net/arknights/images/3/36/Perlica.png' },
    { name: 'Chen Qianyu', rarity: '5', element: 'Unknown', role: 'Guard', image_url: 'https://static.wikia.nocookie.net/arknights/images/f/f6/Chen_Qianyu.png' },
    { name: 'Wulfgard', rarity: '5', element: 'Unknown', role: 'Caster', image_url: 'https://static.wikia.nocookie.net/arknights/images/4/4c/Wulfgard.png' },
    { name: 'Ardelia', rarity: '6', element: 'Nature', role: 'Supporter', image_url: '' },
    { name: 'Ember', rarity: '6', element: 'Heat', role: 'Defender', image_url: '' },
    { name: 'Gilberta', rarity: '6', element: 'Nature', role: 'Supporter', image_url: '' },
    { name: 'Laevatain', rarity: '6', element: 'Heat', role: 'Striker', image_url: '' },
    { name: 'Last Rite', rarity: '6', element: 'Cryo', role: 'Striker', image_url: '' },
    { name: 'Lifeng', rarity: '6', element: 'Unknown', role: 'Guard', image_url: '' },
    { name: 'Pogranichnik', rarity: '6', element: 'Physical', role: 'Vanguard', image_url: '' },
    { name: 'Yvonne', rarity: '6', element: 'Cryo', role: 'Caster', image_url: '' },
    // 5-Star
    { name: 'Da Pan', rarity: '5', element: 'Unknown', role: 'Striker', image_url: '' },
    { name: 'Snowshine', rarity: '5', element: 'Cryo', role: 'Defender', image_url: '' },
    { name: 'Xaihi', rarity: '5', element: 'Unknown', role: 'Supporter', image_url: '' },
    { name: 'Alesh', rarity: '5', element: 'Unknown', role: 'Vanguard', image_url: '' },
    { name: 'Arclight', rarity: '5', element: 'Unknown', role: 'Vanguard', image_url: '' },
    { name: 'Avywenna', rarity: '5', element: 'Unknown', role: 'Striker', image_url: '' },
    // 4-Star
    { name: 'Akekuri', rarity: '4', element: 'Unknown', role: 'Vanguard', image_url: '' },
    { name: 'Antal', rarity: '4', element: 'Unknown', role: 'Supporter', image_url: '' },
    { name: 'Catcher', rarity: '4', element: 'Unknown', role: 'Defender', image_url: '' },
    { name: 'Estella', rarity: '4', element: 'Unknown', role: 'Guard', image_url: '' },
    { name: 'Fluorite', rarity: '4', element: 'Unknown', role: 'Caster', image_url: '' }
];

export async function GET() {
    try {
        // 1. Get or Create Game
        let { data: game } = await supabase
            .from('games')
            .select('id')
            .eq('slug', GAME_DATA.slug)
            .single();

        if (!game) {
            const { data: newGame, error: createError } = await supabase
                .from('games')
                .insert([GAME_DATA])
                .select()
                .single();

            if (createError) throw createError;
            game = newGame;
        }

        if (!game) throw new Error('Failed to create/find game');

        // 2. Insert Characters
        let count = 0;
        const results = [];

        for (const char of CHARACTERS) {
            const { data: existing } = await supabase
                .from('characters')
                .select('id')
                .eq('game_id', game.id)
                .eq('name', char.name)
                .single();

            if (!existing) {
                const { error: insertError } = await supabase.from('characters').insert([{
                    game_id: game.id,
                    name: char.name,
                    rarity: char.rarity,
                    element: char.element,
                    role: char.role,
                    image_url: char.image_url || `https://placehold.co/400?text=${char.name.replace(' ', '+')}`,
                    description: `Character from Arknights: Endfield. Rarity: ${char.rarity}-Star, Class: ${char.role}.`
                }]);

                if (insertError) {
                    results.push({ name: char.name, status: 'error', error: insertError.message });
                } else {
                    results.push({ name: char.name, status: 'success' });
                    count++;
                }
            } else {
                results.push({ name: char.name, status: 'skipped (exists)' });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${CHARACTERS.length} characters. Added ${count} new.`,
            gameId: game.id,
            details: results
        });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
