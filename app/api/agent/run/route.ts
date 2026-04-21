import { auth } from '@/auth'
import { runAgentForAllTools } from '@/lib/agent'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  runAgentForAllTools().catch(console.error)
  return NextResponse.json({ message: 'Agent started' })
}
