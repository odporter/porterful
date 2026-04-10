import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import {
  LIKENESS_REGISTRATION_URL,
  getLikenessVerificationState,
  getMonetizationGateMessage,
} from '@/lib/likeness-verification'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// GET the authenticated user from session (server-side)
async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore - called from server component
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY FIX: Get user from server-side session, NOT from client
    const authenticatedUser = await getAuthenticatedUser()
    
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized - must be logged in' }, { status: 401 })
    }

    const { action, amount } = await request.json()
    
    // user_id now comes from the SERVER session, not the client
    const userId = authenticatedUser.id
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (action !== 'get') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const likenessState = getLikenessVerificationState(profile)
      if (!likenessState.verified) {
        return NextResponse.json({
          error: getMonetizationGateMessage(),
          code: 'LIKENESS_VERIFICATION_REQUIRED',
          registrationUrl: LIKENESS_REGISTRATION_URL,
        }, { status: 403 })
      }
    }
    
    if (action === 'reset') {
      const { error } = await supabase
        .from('wallets')
        .update({ balance: 0, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true, message: 'Wallet reset' })
    }
    
    if (action === 'set') {
      if (typeof amount !== 'number' || amount < 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
      }
      
      const { error } = await supabase
        .from('wallets')
        .update({ balance: amount, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true, message: `Wallet set to ${amount}` })
    }
    
    if (action === 'get') {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      // PGRST116 = no rows found, which is fine for a new user
      return NextResponse.json({ success: true, balance: data?.balance || 0 })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Wallet API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to check wallet balance (secure)
export async function GET() {
  try {
    const authenticatedUser = await getAuthenticatedUser()
    
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', authenticatedUser.id)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, balance: data?.balance || 0 })
  } catch (err) {
    console.error('Wallet GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
