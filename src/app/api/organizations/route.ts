import { NextResponse } from 'next/server';
import { organizationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const orgs = organizationDb.getAll();
    return NextResponse.json(apiSuccess(orgs, { total: orgs.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch organizations', 500), { status: 500 });
  }
}
