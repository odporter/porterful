import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: 'Use /api/dropship/printful or /api/dropship/zendrop' }, { status: 400 })
}
