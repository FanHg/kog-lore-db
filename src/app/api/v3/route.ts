import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';
import { BASE_URL } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = getStats();
  return NextResponse.json({
    name: 'KOG Lore Engine V3',
    description: 'AI Native Knowledge Engine for Honor of Kings',
    version: 'v3.0.0',
    baseUrl: `${BASE_URL}/api/v3`,
    stats,
    endpoints: {
      heroes: '/api/v3/heroes',
      factions: '/api/v3/factions',
      events: '/api/v3/events',
      timeline: '/api/v3/timeline',
      relations: '/api/v3/relations',
      locations: '/api/v3/locations',
      organizations: '/api/v3/organizations',
      quotes: '/api/v3/quotes',
      dialogues: '/api/v3/dialogues',
      storyNodes: '/api/v3/story-nodes',
      projects: '/api/v3/projects',
      tasks: '/api/v3/tasks',
      memories: '/api/v3/memories',
      decisions: '/api/v3/decisions',
      prompts: '/api/v3/prompts',
      search: '/api/v3/search?q=:query',
      script: '/api/v3/script',
      export: '/api/v3/export',
    },
    timestamp: new Date().toISOString(),
    version_tag: 'v3',
  });
}
