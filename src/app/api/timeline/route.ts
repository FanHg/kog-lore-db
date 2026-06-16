import { NextResponse } from 'next/server';
import { timelineDb, eventDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const timeline = timelineDb.getAll();
    const allEvents = eventDb.getAll();

    const enriched = timeline.map(entry => ({
      ...entry,
      eventDetails: entry.events
        .map(id => allEvents.find(e => e.id === id))
        .filter(Boolean)
        .map(e => ({ id: e!.id, name: e!.name, type: e!.type, description: e!.description })),
    }));

    return NextResponse.json(apiSuccess(enriched, { total: enriched.length }));
  } catch (err) {
    console.error('Timeline API error:', err);
    return NextResponse.json(apiError('Failed to fetch timeline', 500), { status: 500 });
  }
}
