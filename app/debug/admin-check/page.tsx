'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    return createClient(url, key)
}

export default function DebugPage() {
    const [status, setStatus] = useState<string>('Checking...')
    const [envStatus, setEnvStatus] = useState<any>({})
    const [gameData, setGameData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkSystem = async () => {
            // 1. Check Env Vars
            const envs = {
                NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
            }
            setEnvStatus(envs)

            // 2. Check Supabase
            try {
                const supabase = getSupabase()
                const { data, error: dbError } = await supabase.from('games').select('*').limit(1)

                if (dbError) {
                    setStatus('Error connecting to Database')
                    setError(dbError.message + '\n' + JSON.stringify(dbError, null, 2))
                } else {
                    setStatus(`Success! Found ${data.length} games`)
                    if (data.length > 0) {
                        setGameData(data[0])
                    } else {
                        setError('Connected but tables are empty (0 games found)')
                    }
                }
            } catch (err: any) {
                setStatus('Critical Failure')
                setError(err.message)
            }
        }

        checkSystem()
    }, [])

    return (
        <div className="p-8 font-mono text-white bg-slate-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Client-Side System Debugger</h1>

            <div className="mb-6 p-4 border border-blue-500 rounded bg-slate-800/50">
                <h2 className="text-xl mb-3 border-b border-blue-500/30 pb-2">1. Environment Variables</h2>
                <ul className="space-y-2">
                    {Object.entries(envStatus).map(([key, exists]) => (
                        <li key={key} className="flex items-center gap-2">
                            <span className={exists ? 'text-green-400' : 'text-red-500'}>
                                {exists ? '✅' : '❌'}
                            </span>
                            <span className="opacity-80">{key}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6 p-4 border border-blue-500 rounded bg-slate-800/50">
                <h2 className="text-xl mb-3 border-b border-blue-500/30 pb-2">2. Database Connection</h2>
                <div className={`text-lg font-bold mb-2 ${status.includes('Success') ? 'text-green-400' : 'text-red-400'}`}>
                    {status}
                </div>

                {gameData && (
                    <div className="mt-4 p-3 bg-black/50 rounded overflow-auto">
                        <p className="text-sm text-gray-400 mb-2">Sample Data Received:</p>
                        <pre className="text-xs text-green-300">
                            {JSON.stringify(gameData, null, 2)}
                        </pre>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded overflow-auto">
                        <p className="text-sm text-red-300 mb-2">Error Details:</p>
                        <pre className="text-xs text-red-200 whitespace-pre-wrap">
                            {error}
                        </pre>
                    </div>
                )}
            </div>

            <div className="text-center text-xs text-gray-500 mt-10">
                Thak Talker Debugger v2.0
            </div>
        </div>
    )
}
