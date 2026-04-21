import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status } = await req.json()

  const { data, error } = await supabaseAdmin
    .from('changes')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, tool:tools(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === 'approved' && data.tool) {
    await supabaseAdmin
      .from('tools')
      .update({ active_env: 'release' })
      .eq('id', data.tool_id)
  }

  return NextResponse.json(data)
}
