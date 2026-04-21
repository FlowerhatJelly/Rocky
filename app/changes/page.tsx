'use client'
import { useEffect, useState } from 'react'
import { Change } from '@/types'
import { ChangeCard } from '@/components/ChangeCard'
import Link from 'next/link'

export default function ChangesPage() {
  const [changes, setChanges] = useState<Change[]>([])

  useEffect(() => {
    fetch('/api/changes?status=pending').then(r => r.json()).then(setChanges)
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
    <div className="min-h-screen bg-gray-950 p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-gray-500 hover:text-gray-300">← 돌아가기</Link>
        <h1 className="text-white text-xl font-bold">AI 개선사항 리뷰</h1>
      </div>

      {changes.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">대기 중인 변경사항이 없습니다</p>
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
