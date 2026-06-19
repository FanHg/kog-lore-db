import { NextResponse } from 'next/server';
import { factionDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const factions = factionDb.getAll();
    return NextResponse.json(apiSuccess(factions, { total: factions.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch factions', 500), { status: 500 });
  }
}
