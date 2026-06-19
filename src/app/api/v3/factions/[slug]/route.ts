import { NextResponse } from 'next/server';
import { factionDb, heroDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const faction = factionDb.getById(slug);
    if (!faction) {
      return NextResponse.json(apiError(`Faction not found: ${slug}`, 404), { status: 404 });
    }
    // 获取阵营成员详细信息
    const members = faction.members
      .map(id => heroDb.getById(id))
      .filter(Boolean);
    return NextResponse.json(apiSuccess({
      ...faction,
      memberDetails: members,
    }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch faction', 500), { status: 500 });
  }
}
