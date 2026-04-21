-- 허용된 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin' | 'member'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 등록된 툴
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'web', -- 'web' | 'batch'
  dev_url TEXT,
  release_url TEXT,
  active_env TEXT NOT NULL DEFAULT 'release', -- 'dev' | 'release'
  is_on BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'unknown', -- 'running' | 'stopped' | 'error' | 'unknown'
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI 에이전트 변경사항
CREATE TABLE changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  diff TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 초기 관리자 계정
INSERT INTO users (email, name, role) VALUES
  ('heparilovesdabin@gmail.com', 'Admin', 'admin');
