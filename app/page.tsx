'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ToolsTab } from '@/components/ToolsTab'
import { ChangesTab } from '@/components/ChangesTab'
import { GraceTab } from '@/components/GraceTab'
import { ChatTab } from '@/components/ChatTab'

type Tab = 'tools' | 'changes' | 'grace' | 'chat'

const tabs: { id: Tab; label: string }[] = [
  { id: 'tools', label: '툴' },
  { id: 'changes', label: '변경사항' },
  { id: 'grace', label: 'Grace' },
  { id: 'chat', label: '채팅' },
]

export default function Dashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>('tools')
  const [pendingCount, setPendingCount] = useState(0)
  const [tools, setTools] = useState<{ name: string; is_on: boolean }[]>([])

  useEffect(() => {
    fetch('/api/changes?status=pending').then(r => r.json()).then(d => setPendingCount(d.length ?? 0))
    fetch('/api/tools').then(r => r.json()).then(setTools)
  }, [])

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* 사이드바 */}
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-gray-800 bg-gray-950">
        <div className="px-5 py-5 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-tight">Rocky</h1>
          <p className="text-gray-600 text-xs mt-0.5">{session?.user?.name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition
                ${activeTab === tab.id
                  ? 'bg-gray-800 text-white font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
              {tab.label}
              {tab.id === 'changes' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => signOut()}
            className="w-full text-left px-3 py-2 text-gray-600 hover:text-gray-400 text-sm rounded-lg hover:bg-gray-800/50 transition"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'tools' && <ToolsTab />}
        {activeTab === 'changes' && <ChangesTab />}
        {activeTab === 'grace' && <GraceTab />}
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <ChatTab context={{ tools }} />
          </div>
        )}
      </main>
    </div>
  )
}
