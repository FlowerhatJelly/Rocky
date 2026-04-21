interface Props { count: number }

export function PendingBadge({ count }: Props) {
  if (count === 0) return null
  return (
    <div className="bg-red-900/40 border border-red-700 rounded-xl p-3 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <span className="text-red-400 text-sm font-medium">
        DEV 변경사항 대기 중 ({count}개)
      </span>
      <a href="/changes" className="ml-auto text-red-400 text-sm underline">
        리뷰하기 →
      </a>
    </div>
  )
}
