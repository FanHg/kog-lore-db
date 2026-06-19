import { NextResponse } from 'next/server';
import { quoteDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const heroId = searchParams.get('heroId');
    const quotes = heroId ? quoteDb.getByHeroId(heroId) : quoteDb.getAll();
    return NextResponse.json(apiSuccess(quotes, { total: quotes.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch quotes', 500), { status: 500 });
  }
}
