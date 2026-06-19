import { NextResponse } from 'next/server';
import { buildV3SearchIndex } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    if (!q) {
      return NextResponse.json(apiError('Query parameter "q" is required', 400), { status: 400 });
    }
    
    const index = buildV3SearchIndex();
    const query = q.toLowerCase();
    
    let results = index.filter(item => {
      const searchText = item.searchText?.toLowerCase() || '';
      const name = item.name.toLowerCase();
      const description = item.description.toLowerCase();
      return searchText.includes(query) || name.includes(query) || description.includes(query);
    });
    
    if (type) {
      results = results.filter(item => item.type === type);
    }
    
    // 计算相关度分数（简单版本：匹配次数）
    const scored = results.map(item => {
      const searchText = item.searchText?.toLowerCase() || '';
      const name = item.name.toLowerCase();
      const description = item.description.toLowerCase();
      let score = 0;
      if (name.includes(query)) score += 10;
      if (description.includes(query)) score += 5;
      const matches = (searchText.match(new RegExp(query, 'g')) || []).length;
      score += matches;
      return { ...item, score };
    });
    
    scored.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    const limited = scored.slice(0, limit);
    return NextResponse.json(apiSuccess(limited, { 
      total: results.length, 
      query: q,
      limit,
    }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to search', 500), { status: 500 });
  }
}
