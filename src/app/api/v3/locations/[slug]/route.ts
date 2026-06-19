import { NextResponse } from 'next/server';
import { locationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const location = locationDb.getById(slug);
    if (!location) {
      return NextResponse.json(apiError(`Location not found: ${slug}`, 404), { status: 404 });
    }
    return NextResponse.json(apiSuccess(location));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch location', 500), { status: 500 });
  }
}
