export type ToolType = 'web' | 'batch'
export type EnvType = 'dev' | 'release'
export type ToolStatus = 'running' | 'stopped' | 'error' | 'unknown'
export type ChangeStatus = 'pending' | 'approved' | 'rejected'

export interface Tool {
  id: string
  name: string
  type: ToolType
  dev_url: string | null
  release_url: string | null
  active_env: EnvType
  is_on: boolean
  status: ToolStatus
  last_checked_at: string | null
  created_at: string
}

export interface Change {
  id: string
  tool_id: string
  summary: string
  diff: string | null
  status: ChangeStatus
  created_at: string
  reviewed_at: string | null
  tool?: Tool
}
