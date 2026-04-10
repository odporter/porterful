import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import {
  LIKENESS_REGISTRATION_URL,
  getLikenessVerificationState,
  getMonetizationGateMessage,
} from '@/lib/likeness-verification'

// Sanitize filename to comply with Supabase Storage filename rules
function sanitizeFilename(name: string): string {
  // Get the file extension
  const ext = name.split('.').pop() || ''
  const nameWithoutExt = name.slice(0, -(ext.length + 1))
  
  // Remove or replace problematic characters: < > : " / \ | ? * ( ) [ ]
  // Also remove leading/trailing dots and spaces
  const sanitized = nameWithoutExt
    .replace(/[<>:"/\\|?*()[\]]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/\.\.+/g, '.')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) // Cap at 100 chars to be safe
  
  const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  
  return `${sanitized || 'audio'}.${cleanExt || 'mp3'}`
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Likeness monetization gate
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    const likenessState = getLikenessVerificationState(profile)
    if (!likenessState.verified) {
      return NextResponse.json({
        error: getMonetizationGateMessage(),
        code: 'LIKENESS_VERIFICATION_REQUIRED',
        registrationUrl: LIKENESS_REGISTRATION_URL,
      }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'audio'
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
    }

    // Sanitize filename to avoid Supabase Storage pattern validation errors
    const safeFilename = sanitizeFilename(file.name)
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${safeFilename}`
    const path = `${folder}/${filename}`

    // Upload to Supabase Storage using service role (bypasses RLS)
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/${path}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': file.type || 'audio/mpeg',
          'x-upsert': 'true'
        },
        body: await file.arrayBuffer()
      }
    )

    if (!uploadRes.ok) {
      const error = await uploadRes.text()
      console.error('Upload failed:', error)
      return NextResponse.json({ error: 'Upload failed', details: error }, { status: 500 })
    }

    // Return public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${path}`

    return NextResponse.json({ 
      url: publicUrl,
      path,
      filename: file.name,
      originalName: file.name,
      safeName: safeFilename,
      size: file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
