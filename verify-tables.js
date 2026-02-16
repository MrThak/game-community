
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vsnbpizqsqbazcuhziyq.supabase.co';
const supabaseKey = 'sb_publishable_Ses1IrT8E5C3gRNq2W90EA_v86LQdAw';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTable() {
    console.log('Verifying table: seven_knights_characters...');

    const { data, error } = await supabase
        .from('seven_knights_characters')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error accessing table:', error.message);
        if (error.code === '42P01') { // undefined_table
            console.error('Result: Table does NOT exist.');
        } else {
            console.error('Result: API Error (Table might exist but check RLS or Cache).');
        }
    } else {
        console.log('Result: Table exists and is accessible.');
    }
}

verifyTable();
