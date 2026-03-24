import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { action, user_id, amount } = await request.json()
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    if (action === 'reset') {
      const { error } = await supabase
        .from('wallets')
        .update({ balance: 0, updated_at: new Date().toISOString() })
        .eq('user_id', user_id)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true, message: `Wallet reset for ${user_id}` })
    }
    
    if (action === 'set') {
      const { error } = await supabase
        .from('wallets')
        .update({ balance: amount, updated_at: new Date().toISOString() })
        .eq('user_id', user_id)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true, message: `Wallet set to ${amount} for ${user_id}` })
    }
    
    if (action === 'get') {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user_id)
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true, balance: data?.balance || 0 })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Wallet API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
