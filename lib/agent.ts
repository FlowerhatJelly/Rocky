import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from './supabase'
import { Tool } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function runAgentForTool(tool: Tool): Promise<void> {
  if (!tool.dev_url) return

  let toolInfo = `툴 이름: ${tool.name}\n타입: ${tool.type}\nDEV URL: ${tool.dev_url}`

  try {
    const healthRes = await fetch(`${tool.dev_url}/health`, { signal: AbortSignal.timeout(5000) })
    toolInfo += `\n헬스체크 상태: ${healthRes.status}`
  } catch {
    toolInfo += '\n헬스체크: 접근 불가'
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `당신은 웹 서비스 최적화 전문가입니다. 주어진 툴 정보를 분석하고 개선 제안을 JSON으로 반환하세요. 반드시 이 형식으로만 응답하세요: {"summary": "개선사항 요약 (한국어, 2-3줄)", "diff": "변경 내용 (없으면 null)"}`,
    messages: [{
      role: 'user',
      content: `다음 툴을 분석하고 오늘 밤 적용할 개선사항을 제안해주세요:\n\n${toolInfo}`,
    }],
  })

  const content = response.content[0]
  if (content.type !== 'text') return

  try {
    const result = JSON.parse(content.text)
    await supabaseAdmin.from('changes').insert({
      tool_id: tool.id,
      summary: result.summary,
      diff: result.diff,
      status: 'pending',
    })
  } catch {
    await supabaseAdmin.from('changes').insert({
      tool_id: tool.id,
      summary: content.text.slice(0, 500),
      status: 'pending',
    })
  }
}

export async function runAgentForAllTools(): Promise<void> {
  const { data: tools } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('is_on', true)

  if (!tools?.length) return

  for (const tool of tools) {
    try {
      await runAgentForTool(tool)
    } catch (err) {
      console.error(`Agent failed for tool ${tool.name}:`, err)
    }
  }
}
