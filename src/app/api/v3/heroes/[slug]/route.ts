import { NextResponse } from 'next/server';
import { heroDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const hero = heroDb.getById(slug);
    if (!hero) {
      return NextResponse.json(apiError(`Hero not found: ${slug}`, 404), { status: 404 });
    }
    return NextResponse.json(apiSuccess(hero));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch hero', 500), { status: 500 });
  }
}
