import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabaseAdmin
    .from('app_settings')
    .select('value, updated_at')
    .eq('key', 'grace_url')
    .single()

  const url = data?.value ?? ''
  const updatedAt = data?.updated_at ?? null

  let alive = false
  if (url) {
    try {
      const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(5000) })
      alive = res.ok
    } catch {}
  }

  return NextResponse.json({ url, alive, updatedAt })
}
