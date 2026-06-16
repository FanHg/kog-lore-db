import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/search';
import { apiSuccess, apiError } from '@/lib/utils';

// Search must be dynamic (query-based)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const type = searchParams.get('type') as never || undefined;

    if (!query.trim()) {
      return NextResponse.json(apiSuccess([], { total: 0 }));
    }

    let results = search(query, limit);
    if (type) {
      results = results.filter(r => r.type === type);
    }

    return NextResponse.json(apiSuccess(results, { total: results.length }));
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json(apiError('Search failed', 500), { status: 500 });
  }
}
