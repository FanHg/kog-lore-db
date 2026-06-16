import { NextResponse } from 'next/server';
import { relationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const graphData = relationDb.getGraphData();
    return NextResponse.json(apiSuccess(graphData));
  } catch (err) {
    console.error('Relations API error:', err);
    return NextResponse.json(apiError('Failed to fetch relations', 500), { status: 500 });
  }
}
