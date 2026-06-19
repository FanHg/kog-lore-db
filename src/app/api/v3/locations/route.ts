import { NextResponse } from 'next/server';
import { locationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const locations = locationDb.getAll();
    return NextResponse.json(apiSuccess(locations, { total: locations.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch locations', 500), { status: 500 });
  }
}
