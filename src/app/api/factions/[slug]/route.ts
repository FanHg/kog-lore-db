import { NextRequest, NextResponse } from 'next/server';
import { factionDb, heroDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const faction = factionDb.getById(params.slug);
    if (!faction) {
      return NextResponse.json(apiError('Faction not found', 404), { status: 404 });
    }

    // Enrich member data
    const memberHeroes = faction.members
      .map(id => heroDb.getById(id))
      .filter(Boolean)
      .map(h => ({ id: h!.id, name: h!.name, title: h!.title, role: h!.role }));

    return NextResponse.json(apiSuccess({ ...faction, memberHeroes }));
  } catch (err) {
    console.error('Faction detail API error:', err);
    return NextResponse.json(apiError('Failed to fetch faction', 500), { status: 500 });
  }
}

export async function generateStaticParams() {
  const ids = factionDb.getAllIds();
  return ids.map(id => ({ slug: id }));
}
