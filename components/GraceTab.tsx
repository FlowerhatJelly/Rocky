'use client'
import { useEffect, useState } from 'react'

interface GraceStatus {
  url: string
  alive: boolean
  updatedAt: string | null
}

export function GraceTab() {
  const [status, setStatus] = useState<GraceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSecret, setShowSecret] = useState(false)

  async function checkStatus() {
    setLoading(true)
    const res = await fetch('/api/grace-status').then(r => r.json()).catch(() => null)
    setStatus(res)
    setLoading(false)
  }

  useEffect(() => { checkStatus() }, [])

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">Grace 서버</h2>
        <button
          onClick={checkStatus}
          className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
        >
          새로고침
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">확인 중...</p>
      ) : !status ? (
        <p className="text-red-400 text-sm">상태를 불러올 수 없습니다.</p>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-3 h-3 rounded-full ${status.alive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-white font-medium">
                {status.alive ? '온라인' : '오프라인'}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">터널 URL</span>
                <p className="text-gray-200 font-mono text-xs mt-1 break-all">{status.url || '없음'}</p>
              </div>
              {status.updatedAt && (
                <div>
                  <span className="text-gray-500">마지막 업데이트</span>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(status.updatedAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-2">시작 명령어</p>
            <pre className="text-gray-300 text-xs font-mono bg-gray-800 rounded-lg p-3">
{`cd C:\\Users\\HEPARI\\Desktop\\HepariHOME\\projects\\grace
.\\start.ps1`}
            </pre>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Grace Secret</span>
              <button
                onClick={() => setShowSecret(s => !s)}
                className="text-gray-500 hover:text-gray-300 text-xs"
              >
                {showSecret ? '숨기기' : '보기'}
              </button>
            </div>
            <p className="text-gray-300 font-mono text-xs break-all">
              {showSecret
                ? 'c3e5c0f73bb0bb40b8d4042c7d9ec74514bc7b71bfacc0dad718f20403f2528d'
                : '••••••••••••••••••••••••••••••••'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
