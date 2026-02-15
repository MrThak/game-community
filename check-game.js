require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkGame() {
    const { data, error } = await supabase
        .from('games')
        .select('id, name')
        .ilike('name', '%Arknights%') // Loose search

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Found Games:', data);
    }
}

checkGame();
