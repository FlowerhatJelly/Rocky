import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: tools } = await supabaseAdmin.from('tools').select('*')
  if (!tools?.length) return NextResponse.json({ checked: 0 })

  const results = await Promise.allSettled(
    tools.map(async (tool) => {
      const targetUrl = tool.active_env === 'dev' ? tool.dev_url : tool.release_url
      if (!targetUrl) return { id: tool.id, status: 'stopped' }

      try {
        const res = await fetch(`${targetUrl}/health`, {
          signal: AbortSignal.timeout(5000),
        })
        return { id: tool.id, status: res.ok ? 'running' : 'error' }
      } catch {
        return { id: tool.id, status: tool.is_on ? 'error' : 'stopped' }
      }
    })
  )

  for (const result of results) {
    if (result.status === 'fulfilled') {
      await supabaseAdmin
        .from('tools')
        .update({ status: result.value.status, last_checked_at: new Date().toISOString() })
        .eq('id', result.value.id)
    }
  }

  return NextResponse.json({ checked: tools.length })
}
