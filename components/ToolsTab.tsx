'use client'
import { useState, useEffect } from 'react'
import { Tool } from '@/types'
import { ToolCard } from '@/components/ToolCard'
import { AddToolModal } from '@/components/AddToolModal'

export function ToolsTab() {
  const [tools, setTools] = useState<Tool[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch('/api/tools').then(r => r.json()).then(setTools)

    const interval = setInterval(async () => {
      await fetch('/api/tools/health-check', { method: 'POST' })
      fetch('/api/tools').then(r => r.json()).then(setTools)
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  async function handleToggle(id: string, is_on: boolean) {
    await fetch(`/api/tools/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_on }),
    })
    setTools(prev => prev.map(t => t.id === id ? { ...t, is_on } : t))
  }

  async function handleEnvChange(id: string, active_env: 'dev' | 'release') {
    await fetch(`/api/tools/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active_env }),
    })
    setTools(prev => prev.map(t => t.id === id ? { ...t, active_env } : t))
  }

  async function handleAdd(tool: { name: string; type: string; dev_url: string; release_url: string }) {
    const res = await fetch('/api/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tool),
    })
    const newTool = await res.json()
    setTools(prev => [...prev, newTool])
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">툴 목록</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition"
        >
          + 툴 추가
        </button>
      </div>

      <div className="space-y-3">
        {tools.length === 0 && (
          <p className="text-gray-600 text-sm">등록된 툴이 없습니다.</p>
        )}
        {tools.map(tool => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onToggle={handleToggle}
            onEnvChange={handleEnvChange}
          />
        ))}
      </div>

      {showModal && <AddToolModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  )
}
