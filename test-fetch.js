const url = 'https://vsnbpizqsqbazcuhziyq.supabase.co/rest/v1/games?select=id';
const apiKey = 'sb_publishable_Ses1IrT8E5C3gRNq2W90EA_v86LQdAw';

async function testFETCH() {
    try {
        const response = await fetch(url, {
            headers: {
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Body:', text);
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testFETCH();
