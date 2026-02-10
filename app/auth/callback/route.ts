// Reverted to simple redirect due to dependencies issue
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    // We cannot exchange code for session here without @supabase/ssr or @supabase/auth-helpers-nextjs
    // For now, we just redirect to home. Client-side auth state might not persist perfectly on server-side render immediately.
    // The user will be logged in on client side via the implicit flow if configured, but for PKCE we need exchange.

    // To "cut the problem", we redirect to home. 
    // If the user uses "Implicit" flow in Supabase settings (not default), it might work.

    return NextResponse.redirect(`${origin}`)
}
