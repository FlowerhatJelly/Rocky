import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

async function proxyRequest(req: NextRequest, toolId: string) {
  const { data: tool } = await supabaseAdmin
    .from('tools')
    .select('*')
    .eq('id', toolId)
    .single()

  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
  }

  if (!tool.is_on) {
    return NextResponse.redirect(new URL('/maintenance', req.url))
  }

  const targetBase = tool.active_env === 'dev' ? tool.dev_url : tool.release_url
  if (!targetBase) {
    return NextResponse.json({ error: 'Target URL not configured' }, { status: 502 })
  }

  const url = new URL(req.url)
  const proxyPath = url.pathname.replace(`/api/proxy/${toolId}`, '') || '/'
  const targetUrl = `${targetBase}${proxyPath}${url.search}`

  try {
    const proxyRes = await fetch(targetUrl, {
      method: req.method,
      headers: Object.fromEntries(req.headers),
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    })

    return new NextResponse(proxyRes.body, {
      status: proxyRes.status,
      headers: new Headers(proxyRes.headers),
    })
  } catch {
    return NextResponse.json({ error: 'Proxy error' }, { status: 502 })
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ toolId: string }> }) {
  return proxyRequest(req, (await params).toolId)
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ toolId: string }> }) {
  return proxyRequest(req, (await params).toolId)
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ toolId: string }> }) {
  return proxyRequest(req, (await params).toolId)
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ toolId: string }> }) {
  return proxyRequest(req, (await params).toolId)
}
