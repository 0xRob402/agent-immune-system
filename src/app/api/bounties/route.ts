import { NextRequest, NextResponse } from 'next/server';
import { getBounties, createBounty, type Bounty } from '@/lib/pressbase';

export const dynamic = 'force-dynamic';

// GET /api/bounties - List bounties
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  const result = await getBounties({ status, limit });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ bounties: result.data });
}

// POST /api/bounties - Create a new bounty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Omit<Bounty, 'id' | 'created_at' | 'updated_at'>;

    // Validate required fields
    if (!body.repo_owner || !body.repo_name || !body.issue_number || !body.issue_title || !body.issue_url) {
      return NextResponse.json(
        { error: 'Missing required fields: repo_owner, repo_name, issue_number, issue_title, issue_url' },
        { status: 400 }
      );
    }

    const result = await createBounty({
      ...body,
      status: body.status || 'found',
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ bounty: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
