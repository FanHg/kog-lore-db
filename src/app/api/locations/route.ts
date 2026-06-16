import { NextResponse } from 'next/server';
import { locationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const locations = locationDb.getAll();
    const light = locations.map(({ content: _c, ...rest }) => rest);
    return NextResponse.json(apiSuccess(light, { total: light.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch locations', 500), { status: 500 });
  }
}
