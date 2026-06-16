import { NextRequest, NextResponse } from 'next/server';
import { eventDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const era = searchParams.get('era');
    const type = searchParams.get('type');

    let events = eventDb.getAll();
    if (era) events = events.filter(e => e.era === era);
    if (type) events = events.filter(e => e.type === type);

    const lightEvents = events.map(({ content: _c, ...rest }) => rest);
    return NextResponse.json(apiSuccess(lightEvents, { total: lightEvents.length }));
  } catch (err) {
    console.error('Events API error:', err);
    return NextResponse.json(apiError('Failed to fetch events', 500), { status: 500 });
  }
}
