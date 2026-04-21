'use client'
import { useState } from 'react'
import { Change } from '@/types'

interface Props {
  change: Change
  onReview: (id: string, status: 'approved' | 'rejected') => void
}

export function ChangeCard({ change, onReview }: Props) {
  const [showDiff, setShowDiff] = useState(false)

  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-white font-medium">{(change as any).tool?.name ?? '알 수 없는 툴'}</p>
          <p className="text-gray-500 text-xs">
            {new Date(change.created_at).toLocaleString('ko-KR')} — AI 자동 작업
          </p>
        </div>
        <span className="text-yellow-400 text-xs bg-yellow-900/30 px-2 py-1 rounded-full">대기중</span>
      </div>

      <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">{change.summary}</p>

      {change.diff && (
        <button
          onClick={() => setShowDiff(!showDiff)}
          className="text-blue-400 text-xs underline mb-3"
        >
          {showDiff ? 'diff 숨기기' : 'diff 보기'}
        </button>
      )}

      {showDiff && change.diff && (
        <pre className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto mb-3 max-h-64">
          {change.diff}
        </pre>
      )}

      {change.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onReview(change.id, 'rejected')}
            className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-xl text-sm"
          >
            거절
          </button>
          <button
            onClick={() => onReview(change.id, 'approved')}
            className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-xl text-sm"
          >
            RELEASE 반영
          </button>
        </div>
      )}
    </div>
  )
}
