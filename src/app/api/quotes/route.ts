import { NextResponse } from 'next/server';
import { quoteDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const quotes = quoteDb.getAll();
    return NextResponse.json(apiSuccess(quotes, { total: quotes.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch quotes', 500), { status: 500 });
  }
}
