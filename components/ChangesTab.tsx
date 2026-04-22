'use client'
import { useEffect, useState } from 'react'
import { Change } from '@/types'
import { ChangeCard } from '@/components/ChangeCard'

export function ChangesTab() {
  const [changes, setChanges] = useState<Change[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/changes?status=pending')
      .then(r => r.json())
      .then(data => { setChanges(data); setLoading(false) })
  }, [])

  async function handleReview(id: string, status: 'approved' | 'rejected') {
    await fetch(`/api/changes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setChanges(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-white text-xl font-bold mb-6">변경사항 리뷰</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      ) : changes.length === 0 ? (
        <p className="text-gray-600 text-sm">대기 중인 변경사항이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {changes.map(change => (
            <ChangeCard key={change.id} change={change} onReview={handleReview} />
          ))}
        </div>
      )}
    </div>
  )
}
