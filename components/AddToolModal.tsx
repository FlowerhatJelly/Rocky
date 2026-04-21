'use client'
import { useState } from 'react'

interface Props {
  onClose: () => void
  onAdd: (tool: { name: string; type: string; dev_url: string; release_url: string }) => void
}

export function AddToolModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState({ name: '', type: 'web', dev_url: '', release_url: '' })

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-white font-bold text-lg mb-4">툴 추가</h2>
        <div className="space-y-3">
          <input
            placeholder="툴 이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700"
          >
            <option value="web">Web 서버</option>
            <option value="batch">스크립트/배치</option>
          </select>
          <input
            placeholder="DEV URL (예: https://tool-dev.railway.app)"
            value={form.dev_url}
            onChange={(e) => setForm({ ...form, dev_url: e.target.value })}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700"
          />
          <input
            placeholder="RELEASE URL (예: https://tool.railway.app)"
            value={form.release_url}
            onChange={(e) => setForm({ ...form, release_url: e.target.value })}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700"
          />
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 bg-gray-700 text-white py-2 rounded-xl text-sm">취소</button>
          <button
            onClick={() => { onAdd(form); onClose() }}
            disabled={!form.name}
            className="flex-1 bg-white text-gray-900 font-semibold py-2 rounded-xl text-sm disabled:opacity-40"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  )
}
