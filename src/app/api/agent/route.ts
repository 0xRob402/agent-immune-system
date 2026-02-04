import { NextRequest, NextResponse } from 'next/server';
import { getAgentByApiKey } from '@/lib/db';

export async function GET(request: NextRequest) {
  const apiKey = request.nextUrl.searchParams.get('apiKey');

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'API key required' }, { status: 400 });
  }

  const result = await getAgentByApiKey(apiKey);

  if (!result.ok || !result.data) {
    return NextResponse.json({ ok: false, error: 'Invalid API key' }, { status: 401 });
  }

  // Don't expose the API key in the response
  const { api_key, ...agent } = result.data;

  return NextResponse.json({ ok: true, agent });
}
