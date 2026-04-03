import { NextRequest, NextResponse } from 'next/server'
import { existsSync, mkdirSync, appendFileSync, readFileSync } from 'fs'

// ── Supabase mode ─────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// ── Fallback /tmp mode (Vercel ephemeral — use Supabase for prod) ───
const DATA_DIR   = '/tmp/porterful-leads'
const EMAILS_FILE = `${DATA_DIR}/emails.jsonl`

async function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(SUPABASE_URL, SUPABASE_KEY)
}

function getLeadsFallback(): any[] {
  try {
    if (!existsSync(EMAILS_FILE)) return []
    return readFileSync(EMAILS_FILE, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((l: string) => JSON.parse(l))
  } catch { return [] }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = await getSupabase()
    const id = `PF-${Date.now().toString(36).toUpperCase()}`
    const cleanEmail = email.toLowerCase().trim()
    const now = new Date().toISOString()

    if (supabase) {
      // ── Supabase mode ───────────────────────────────────────────────
      const { error } = await supabase
        .from('porterful_leads')
        .upsert({ email: cleanEmail, name: name?.trim() ?? '', source: source || 'homepage' },
                 { onConflict: 'email' })

      if (error && !error.message.includes('duplicate')) {
        console.error('[leads/supabase]', error)
        return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
      }
    } else {
      // ── Fallback mode ───────────────────────────────────────────────
      if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
      const lead = { id, timestamp: now, email: cleanEmail, name: name?.trim() ?? '', source: source || 'homepage' }
      appendFileSync(EMAILS_FILE, JSON.stringify(lead) + '\n')
    }

    return NextResponse.json({
      success: true,
      leadId: id,
      message: "You're on the list! We'll be in touch."
    })
  } catch (error: any) {
    console.error('[leads]', error)
    return NextResponse.json({ error: 'Failed to capture email' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('porterful_leads')
      .select('id, email, name, source, created_at')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ total: data?.length ?? 0, recent: data ?? [] })
  }
  // Fallback
  const leads = getLeadsFallback()
  return NextResponse.json({ total: leads.length, recent: leads.slice(-20).reverse() })
}
