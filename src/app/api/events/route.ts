import { NextRequest, NextResponse } from 'next/server';
import { getAgentByApiKey, getEventsForAgent } from '@/lib/db';

export async function GET(request: NextRequest) {
  const apiKey = request.nextUrl.searchParams.get('apiKey');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'API key required' }, { status: 400 });
  }

  const agentResult = await getAgentByApiKey(apiKey);

  if (!agentResult.ok || !agentResult.data) {
    return NextResponse.json({ ok: false, error: 'Invalid API key' }, { status: 401 });
  }

  const eventsResult = await getEventsForAgent(agentResult.data.id!, limit);
  
  // Map to dashboard-friendly format
  const events = (eventsResult.ok ? eventsResult.data : []).map(e => ({
    tool: e.tool_name,
    blocked: e.decision === 'block',
    block_reason: e.threat_type || e.event_type,
    created_at: e.created_at,
  }));

  return NextResponse.json({ ok: true, events });
}
