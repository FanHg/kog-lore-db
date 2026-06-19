import { NextResponse } from 'next/server';
import { eventDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = eventDb.getAll();
    return NextResponse.json(apiSuccess(events, { total: events.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch events', 500), { status: 500 });
  }
}
