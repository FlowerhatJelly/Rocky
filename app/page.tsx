'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Tool } from '@/types'
import { ToolCard } from '@/components/ToolCard'
import { PendingBadge } from '@/components/PendingBadge'
import { AddToolModal } from '@/components/AddToolModal'

export default function Dashboard() {
  const { data: session } = useSession()
  const [tools, setTools] = useState<Tool[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch('/api/tools').then(r => r.json()).then(setTools)
    fetch('/api/changes?status=pending').then(r => r.json()).then(d => setPendingCount(d.length ?? 0))

    const interval = setInterval(async () => {
      await fetch('/api/tools/health-check', { method: 'POST' })
      const updated = await fetch('/api/tools').then(r => r.json())
      setTools(updated)
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
    <div className="min-h-screen bg-gray-950 p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">Rocky</h1>
        <button onClick={() => signOut()} className="text-gray-500 text-sm hover:text-gray-300">
          {session?.user?.name ?? '로그아웃'}
        </button>
      </div>

      <div className="mb-4">
        <PendingBadge count={pendingCount} />
      </div>

      <div className="space-y-3">
        {tools.map(tool => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onToggle={handleToggle}
            onEnvChange={handleEnvChange}
          />
        ))}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-sm transition"
      >
        + 툴 추가
      </button>

      {showModal && <AddToolModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  )
}
