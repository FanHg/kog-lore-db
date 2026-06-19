import { NextResponse } from 'next/server';
import { storyNodeDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const heroId = searchParams.get('heroId');
    let nodes = storyNodeDb.getAll();
    if (eventId) {
      nodes = nodes.filter(n => n.eventId === eventId);
    }
    if (heroId) {
      nodes = nodes.filter(n => n.characters.includes(heroId));
    }
    return NextResponse.json(apiSuccess(nodes, { total: nodes.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch story nodes', 500), { status: 500 });
  }
}
