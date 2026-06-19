import { NextResponse } from 'next/server';
import { heroDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const heroes = heroDb.getAll();
    return NextResponse.json(apiSuccess(heroes, { total: heroes.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch heroes', 500), { status: 500 });
  }
}
