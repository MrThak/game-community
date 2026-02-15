require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const GAME_DATA = {
    name: 'Arknights: Endfield',
    slug: 'arknights-endfield',
    icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Arknights_Endfield_logo.png/220px-Arknights_Endfield_logo.png' // Placeholder/Public URL
};

const CHARACTERS = [
    // 6-Star
    { name: 'Endministrator', rarity: '6', element: 'Physical', role: 'Guard', image_url: 'https://static.wikia.nocookie.net/arknights/images/6/6a/Endministrator.png' },
    { name: 'Perlica', rarity: '5', element: 'TBC', role: 'Caster', image_url: 'https://static.wikia.nocookie.net/arknights/images/3/36/Perlica.png' },
    { name: 'Chen Qianyu', rarity: '5', element: 'TBC', role: 'Guard', image_url: 'https://static.wikia.nocookie.net/arknights/images/f/f6/Chen_Qianyu.png' },
    { name: 'Wulfgard', rarity: '5', element: 'TBC', role: 'Caster', image_url: 'https://static.wikia.nocookie.net/arknights/images/4/4c/Wulfgard.png' },
    { name: 'Ardelia', rarity: '6', element: 'Nature', role: 'Supporter', image_url: '' },
    { name: 'Ember', rarity: '6', element: 'Heat', role: 'Defender', image_url: '' },
    { name: 'Gilberta', rarity: '6', element: 'Nature', role: 'Supporter', image_url: '' },
    { name: 'Laevatain', rarity: '6', element: 'Heat', role: 'Striker', image_url: '' },
    { name: 'Last Rite', rarity: '6', element: 'Cryo', role: 'Striker', image_url: '' },
    { name: 'Lifeng', rarity: '6', element: 'TBC', role: 'Guard', image_url: '' },
    { name: 'Pogranichnik', rarity: '6', element: 'Physical', role: 'Vanguard', image_url: '' },
    { name: 'Yvonne', rarity: '6', element: 'Cryo', role: 'Caster', image_url: '' },
    // 5-Star
    { name: 'Da Pan', rarity: '5', element: 'TBC', role: 'Striker', image_url: '' },
    { name: 'Snowshine', rarity: '5', element: 'Cryo', role: 'Defender', image_url: '' },
    { name: 'Xaihi', rarity: '5', element: 'TBC', role: 'Supporter', image_url: '' },
    { name: 'Alesh', rarity: '5', element: 'TBC', role: 'Vanguard', image_url: '' },
    { name: 'Arclight', rarity: '5', element: 'TBC', role: 'Vanguard', image_url: '' },
    { name: 'Avywenna', rarity: '5', element: 'TBC', role: 'Striker', image_url: '' },
    // 4-Star
    { name: 'Akekuri', rarity: '4', element: 'TBC', role: 'Vanguard', image_url: '' },
    { name: 'Antal', rarity: '4', element: 'TBC', role: 'Supporter', image_url: '' },
    { name: 'Catcher', rarity: '4', element: 'TBC', role: 'Defender', image_url: '' },
    { name: 'Estella', rarity: '4', element: 'TBC', role: 'Guard', image_url: '' },
    { name: 'Fluorite', rarity: '4', element: 'TBC', role: 'Caster', image_url: '' }
];

async function seed() {
    console.log('Seeding Arknights: Endfield...');

    // 1. Get or Create Game
    let { data: game, error: gameError } = await supabase
        .from('games')
        .select('id')
        .eq('slug', GAME_DATA.slug)
        .single();

    if (!game) {
        console.log('Game not found, creating...');
        const { data: newGame, error: createError } = await supabase
            .from('games')
            .insert([GAME_DATA])
            .select()
            .single();

        if (createError) {
            console.error('Error creating game:', createError);
            return;
        }
        game = newGame;
    }

    console.log(`Game ID: ${game.id}`);

    // 2. Prepare Characters
    const charsToInsert = CHARACTERS.map(c => ({
        game_id: game.id,
        name: c.name,
        rarity: c.rarity,
        element: c.element,
        role: c.role,
        image_url: c.image_url || `https://placehold.co/400?text=${c.name.replace(' ', '+')}`, // Fallback
        description: `Character from Arknights: Endfield. Rarity: ${c.rarity}-Star, Class: ${c.role}.`
    }));

    // 3. Upsert Characters (avoid duplicates by name+game_id logic would need unique constraint, but standard insert is safer for now)
    // Actually, let's check existence for each to avoid dupes if run multiple times, or just use upsert if we had a constraint.
    // For simplicity in this script, we'll iterate and check.

    let count = 0;
    for (const char of charsToInsert) {
        const { data: existing } = await supabase
            .from('characters')
            .select('id')
            .eq('game_id', game.id)
            .eq('name', char.name)
            .single();

        if (!existing) {
            const { error: insertError } = await supabase.from('characters').insert([char]);
            if (insertError) console.error(`Failed to insert ${char.name}:`, insertError.message);
            else {
                console.log(`Inserted: ${char.name}`);
                count++;
            }
        } else {
            console.log(`Skipped (Exists): ${char.name}`);
        }
    }

    console.log(`Done! Added ${count} characters.`);
}

seed();
