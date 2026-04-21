import { auth } from '@/auth'
import { chatWithGrace, ChatMessage } from '@/lib/grace'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `당신은 개인 툴 대시보드 Rocky의 어시스턴트입니다.
툴 관리, 자동화, 개발 관련 질문에 답변합니다.
한국어로 답변하세요.`

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, context } = await req.json()

  try {
    const message = await chatWithGrace(messages as ChatMessage[], context, SYSTEM, 'rocky')
    return NextResponse.json({ message })
  } catch (err) {
    const error = err instanceof Error ? err.message : '알 수 없는 오류'
    return NextResponse.json({ error }, { status: 500 })
  }
}
