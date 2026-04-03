import { NextRequest, NextResponse } from 'next/server'
import { existsSync, mkdirSync, readFileSync, appendFileSync } from 'fs'

const DATA_DIR = '/tmp/porterful-leads'
const EMAILS_FILE = `${DATA_DIR}/emails.jsonl`

function getLeads(): any[] {
  try {
    if (!existsSync(EMAILS_FILE)) return []
    const content = readFileSync(EMAILS_FILE, 'utf8')
    return content.trim().split('\n').filter(Boolean).map((l: string) => JSON.parse(l))
  } catch {
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const lead = {
      id: `PF-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      email: email.toLowerCase().trim(),
      name: name?.trim() || '',
      source: source || 'homepage',
    }

    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true })
    }

    appendFileSync(EMAILS_FILE, JSON.stringify(lead) + '\n')

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: "You're on the list! We'll be in touch."
    })
  } catch (error: any) {
    console.error('Email capture error:', error)
    return NextResponse.json({ error: 'Failed to capture email' }, { status: 500 })
  }
}

export async function GET() {
  const leads = getLeads()
  return NextResponse.json({
    total: leads.length,
    emails: leads.map((l: any) => l.email),
    recent: leads.slice(-20).reverse(),
  })
}
