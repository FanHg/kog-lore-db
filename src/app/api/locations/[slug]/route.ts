import { NextRequest, NextResponse } from 'next/server';
import { locationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const location = locationDb.getById(params.slug);
    if (!location) {
      return NextResponse.json(apiError('Location not found', 404), { status: 404 });
    }
    return NextResponse.json(apiSuccess(location));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch location', 500), { status: 500 });
  }
}

export async function generateStaticParams() {
  const ids = locationDb.getAllIds();
  return ids.map(id => ({ slug: id }));
}
