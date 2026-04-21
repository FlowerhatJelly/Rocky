'use client'
import { Tool } from '@/types'

interface Props {
  tool: Tool
  onToggle: (id: string, is_on: boolean) => void
  onEnvChange: (id: string, env: 'dev' | 'release') => void
}

export function ToolCard({ tool, onToggle, onEnvChange }: Props) {
  const statusColor = {
    running: 'bg-green-500',
    stopped: 'bg-gray-500',
    error: 'bg-red-500',
    unknown: 'bg-yellow-500',
  }[tool.status]

  return (
    <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`} />
        <div className="min-w-0">
          <p className="text-white font-medium truncate">{tool.name}</p>
          <p className="text-gray-500 text-xs">{tool.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <select
          value={tool.active_env}
          onChange={(e) => onEnvChange(tool.id, e.target.value as 'dev' | 'release')}
          className="bg-gray-800 text-gray-300 text-sm rounded-lg px-2 py-1 border border-gray-700"
        >
          <option value="dev">DEV</option>
          <option value="release">RELEASE</option>
        </select>

        <button
          onClick={() => onToggle(tool.id, !tool.is_on)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            tool.is_on ? 'bg-green-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              tool.is_on ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )
}
