import { NextRequest, NextResponse } from 'next/server';
import { eventDb, heroDb, factionDb, locationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = eventDb.getById(params.slug);
    if (!event) {
      return NextResponse.json(apiError('Event not found', 404), { status: 404 });
    }

    const participantHeroes = event.participants
      .map(id => heroDb.getById(id))
      .filter(Boolean)
      .map(h => ({ id: h!.id, name: h!.name, title: h!.title }));

    const involvedFactions = event.factions
      .map(id => factionDb.getById(id))
      .filter(Boolean)
      .map(f => ({ id: f!.id, name: f!.name }));

    const eventLocations = event.locations
      .map(id => locationDb.getById(id))
      .filter(Boolean)
      .map(l => ({ id: l!.id, name: l!.name }));

    return NextResponse.json(apiSuccess({
      ...event,
      participantHeroes,
      involvedFactions,
      eventLocations,
    }));
  } catch (err) {
    console.error('Event detail API error:', err);
    return NextResponse.json(apiError('Failed to fetch event', 500), { status: 500 });
  }
}

export async function generateStaticParams() {
  const ids = eventDb.getAllIds();
  return ids.map(id => ({ slug: id }));
}
