import { NextResponse } from 'next/server';
import { getStats, getActivities } from '@/lib/pressbase';

export const dynamic = 'force-dynamic';

// GET /api/stats - Get dashboard stats
export async function GET() {
  try {
    const [stats, activities] = await Promise.all([
      getStats(),
      getActivities(50),
    ]);

    return NextResponse.json({
      ...stats,
      recentActivities: activities.data || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
