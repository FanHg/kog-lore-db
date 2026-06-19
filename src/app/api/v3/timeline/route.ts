import { NextResponse } from 'next/server';
import { timelineDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const timeline = timelineDb.getAll();
    return NextResponse.json(apiSuccess(timeline, { total: timeline.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch timeline', 500), { status: 500 });
  }
}
