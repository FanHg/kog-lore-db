import { NextRequest, NextResponse } from 'next/server';
import { factionDb, heroDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET(_request: NextRequest) {
  try {
    const factions = factionDb.getAll();
    const enriched = factions.map(f => ({
      ...f,
      memberCount: f.members.length,
    }));
    return NextResponse.json(apiSuccess(enriched, { total: enriched.length }));
  } catch (err) {
    console.error('Factions API error:', err);
    return NextResponse.json(apiError('Failed to fetch factions', 500), { status: 500 });
  }
}
