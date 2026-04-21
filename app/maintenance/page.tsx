export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">점검 중</h1>
        <p className="text-gray-400">현재 이 서비스는 일시적으로 비활성화되어 있습니다.</p>
        <p className="text-gray-600 text-sm mt-2">잠시 후 다시 시도해주세요.</p>
      </div>
    </div>
  )
}
