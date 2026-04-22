'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  context?: Record<string, unknown>
}

export function ChatTab({ context }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next, context }),
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.message ?? data.error ?? '오류 발생' }])
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <h2 className="text-white font-bold">Claude (Grace)</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-600 text-sm text-center mt-20">Rocky나 툴에 대해 물어보세요...</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed
              ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl px-4 py-3 text-gray-500 text-sm">생각 중...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-800 flex gap-3 shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="메시지 입력..."
          className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl text-sm disabled:opacity-40 transition"
        >
          전송
        </button>
      </div>
    </div>
  )
}
