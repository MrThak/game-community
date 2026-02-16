
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vsnbpizqsqbazcuhziyq.supabase.co';
const supabaseKey = 'sb_publishable_Ses1IrT8E5C3gRNq2W90EA_v86LQdAw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMetadata() {
    console.log('Verifying Game Metadata...');

    // Fetch Seven Knights game
    const { data: games, error } = await supabase
        .from('games')
        .select('*')
        .ilike('name', '%Rebirth%');

    if (error) {
        console.error('Error fetching games:', error);
        return;
    }

    if (!games || games.length === 0) {
        console.error('No "Seven Knights Rebirth" game found.');
        return;
    }

    const game = games[0];
    console.log('Found Game:', game.name, '(' + game.id + ')');
    console.log('Metadata:', JSON.stringify(game.metadata, null, 2));

    if (!game.metadata || !game.metadata.tables || !game.metadata.tables.characters) {
        console.error('CRITICAL: Metadata is missing table configuration!');
    } else {
        const tableName = game.metadata.tables.characters;
        console.log('Character Table Configured As:', tableName);

        // Verify if that table exists/is accessible
        const { error: tableError } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
        if (tableError) {
            console.error(`Error accessing table "${tableName}":`, tableError.message);
        } else {
            console.log(`Table "${tableName}" is accessible.`);
        }
    }
}

verifyMetadata();
