import { NextResponse } from 'next/server';
import { eventDb, heroDb, locationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const event = eventDb.getById(slug);
    if (!event) {
      return NextResponse.json(apiError(`Event not found: ${slug}`, 404), { status: 404 });
    }
    // 获取参与者详细信息
    const participants = event.participants
      .map(id => heroDb.getById(id))
      .filter(Boolean);
    const locations = event.locations
      .map(id => locationDb.getById(id))
      .filter(Boolean);
    return NextResponse.json(apiSuccess({
      ...event,
      participantDetails: participants,
      locationDetails: locations,
    }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch event', 500), { status: 500 });
  }
}
