import { NextResponse } from 'next/server';
import { dialogueDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const heroId = searchParams.get('heroId');
    const dialogues = heroId ? dialogueDb.getByHeroId(heroId) : dialogueDb.getAll();
    return NextResponse.json(apiSuccess(dialogues, { total: dialogues.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch dialogues', 500), { status: 500 });
  }
}
