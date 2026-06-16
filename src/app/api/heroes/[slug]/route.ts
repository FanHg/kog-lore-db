import { NextRequest, NextResponse } from 'next/server';
import { heroDb, quoteDb, eventDb, relationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const hero = heroDb.getById(params.slug);
    if (!hero) {
      return NextResponse.json(apiError('Hero not found', 404), { status: 404 });
    }

    // Enrich with related data
    const quotes = quoteDb.getByHeroId(hero.id);
    const events = eventDb.getByParticipant(hero.id);
    const relations = relationDb.getByHeroId(hero.id);

    return NextResponse.json(apiSuccess({
      ...hero,
      quotes,
      relatedEvents: events.map(e => ({ id: e.id, name: e.name, era: e.era })),
      enrichedRelations: relations,
    }));
  } catch (err) {
    console.error('Hero detail API error:', err);
    return NextResponse.json(apiError('Failed to fetch hero', 500), { status: 500 });
  }
}

export async function generateStaticParams() {
  const ids = heroDb.getAllIds();
  return ids.map(id => ({ slug: id }));
}
