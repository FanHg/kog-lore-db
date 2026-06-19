import { NextResponse } from 'next/server';
import { memoryDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const heroId = searchParams.get('heroId');
    let memories = memoryDb.getAll();
    if (projectId) {
      memories = memories.filter(m => m.projectId === projectId);
    }
    if (heroId) {
      memories = memories.filter(m => m.heroIds?.includes(heroId) || false);
    }
    return NextResponse.json(apiSuccess(memories, { total: memories.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch memories', 500), { status: 500 });
  }
}
