import { NextRequest, NextResponse } from 'next/server';
import { heroDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const faction = searchParams.get('faction');
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    let heroes = heroDb.getAll();

    if (faction) {
      heroes = heroes.filter(h => h.faction === faction);
    }
    if (role) {
      heroes = heroes.filter(h => h.role.includes(role as never));
    }

    const total = heroes.length;
    const start = (page - 1) * pageSize;
    const paged = heroes.slice(start, start + pageSize);

    // Strip lore content from list view for performance
    const lightHeroes = paged.map(({ lore: _lore, ...rest }) => rest);

    return NextResponse.json(apiSuccess(lightHeroes, { total, page, pageSize }));
  } catch (err) {
    console.error('Heroes API error:', err);
    return NextResponse.json(apiError('Failed to fetch heroes', 500), { status: 500 });
  }
}
