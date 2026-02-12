import { supabase } from '@/lib/supabase'

export const revalidate = 0

export default async function DebugPage() {
    const envCheck = {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
    }

    let dbStatus = 'Unknown'
    let errorMsg = ''

    try {
        const { data, error } = await supabase.from('games').select('id').limit(1)
        if (error) {
            dbStatus = 'Error: ' + error.message
            errorMsg = JSON.stringify(error, null, 2)
        } else {
            dbStatus = 'Connected! (Table accessible)'
        }
    } catch (e: any) {
        dbStatus = 'Connection Failed'
        errorMsg = e.message
    }

    return (
        <div className="p-8 font-mono text-white bg-slate-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">System Debug Status</h1>

            <div className="mb-6 p-4 border border-blue-500 rounded">
                <h2 className="text-xl mb-2">1. Environment Variables</h2>
                <ul className="list-disc pl-5">
                    {Object.entries(envCheck).map(([key, exists]) => (
                        <li key={key} className={exists ? 'text-green-400' : 'text-red-500 font-bold'}>
                            {key}: {exists ? '✅ Found' : '❌ MISSING'}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6 p-4 border border-blue-500 rounded">
                <h2 className="text-xl mb-2">2. Database Connection (Sitemap)</h2>
                <p className={dbStatus.includes('Connected') ? 'text-green-400' : 'text-red-500'}>
                    Status: {dbStatus}
                </p>
                {errorMsg && <pre className="mt-2 text-xs text-red-300 bg-black p-2 overflow-auto">{errorMsg}</pre>}
            </div>

            <div className="text-sm text-gray-400 mt-8">
                * This page is for debugging purposes only.
            </div>
        </div>
    )
}
