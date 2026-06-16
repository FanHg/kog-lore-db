import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';
import { apiSuccess, SITE_CONFIG } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const stats = getStats();
  return NextResponse.json(apiSuccess({
    name: SITE_CONFIG.name,
    nameEn: SITE_CONFIG.nameEn,
    description: SITE_CONFIG.description,
    version: '1.0.0',
    stats,
    endpoints: {
      heroes: '/api/heroes',
      heroDetail: '/api/heroes/:id',
      factions: '/api/factions',
      factionDetail: '/api/factions/:id',
      events: '/api/events',
      eventDetail: '/api/events/:id',
      timeline: '/api/timeline',
      relations: '/api/relations',
      locations: '/api/locations',
      locationDetail: '/api/locations/:id',
      organizations: '/api/organizations',
      quotes: '/api/quotes',
      videoTopics: '/api/video-topics',
      search: '/api/search?q=:query',
    },
  }));
}
