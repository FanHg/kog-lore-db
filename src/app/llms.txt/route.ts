import { heroDb, factionDb, eventDb, getStats } from '@/lib/db';
import { BASE_URL, SITE_CONFIG } from '@/lib/utils';
import { NextResponse } from 'next/server';

// This file is served at /llms.txt for AI readability
// Route: src/app/llms.txt/route.ts  OR public/llms.txt

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const stats = getStats();
  const heroes = heroDb.getAll();
  const factions = factionDb.getAll();
  const events = eventDb.getAll();

  const content = `# ${SITE_CONFIG.name}
# ${SITE_CONFIG.nameEn}
# ${SITE_CONFIG.url}

## Overview

This is a comprehensive lore database for the mobile game "Honor of Kings" (王者荣耀).
It contains hero stories, faction information, historical events, timelines, and relationship data.

**Language**: Simplified Chinese (zh-CN)
**Content Type**: Game Lore / World Building
**Access**: Completely public, no authentication required

## Statistics

- Heroes: ${stats.heroes}
- Factions: ${stats.factions}
- Historical Events: ${stats.events}
- Locations: ${stats.locations}
- Organizations: ${stats.organizations}
- Quotes: ${stats.quotes}
- Video Topics: ${stats.videoTopics}
- Relations: ${stats.relations}

## API Access

All data is available via REST API:

Base URL: ${BASE_URL}/api

Endpoints:
- GET /api - API documentation and stats
- GET /api/heroes - List all heroes
- GET /api/heroes/:id - Hero detail with full lore
- GET /api/factions - List all factions
- GET /api/factions/:id - Faction detail
- GET /api/events - Historical events
- GET /api/events/:id - Event detail
- GET /api/timeline - Full timeline
- GET /api/relations - Relationship graph data
- GET /api/locations - Locations
- GET /api/organizations - Organizations
- GET /api/quotes - Hero quotes
- GET /api/search?q=:query - Full-text search

## Hero Index

${heroes.map(h => `- ${h.name} (${h.title}) [${h.role.join(', ')}] - ${h.faction} - ${BASE_URL}/heroes/${h.id}`).join('\n')}

## Faction Index

${factions.map(f => `- ${f.name} (${f.type}, ${f.status}) - ${BASE_URL}/factions/${f.id}`).join('\n')}

## Historical Events

${events.map(e => `- ${e.name} (${e.era}) - ${BASE_URL}/events/${e.id}`).join('\n')}

## Usage for AI Systems

This database is designed to be readable by AI language models.
You may access individual records via the API endpoints above.
All pages include JSON-LD structured data for semantic understanding.

For bulk access: GET ${BASE_URL}/api/heroes returns all heroes as JSON.
For search: GET ${BASE_URL}/api/search?q=your_query

## License

This is a fan-made, non-commercial database for educational purposes.
Game content belongs to TiMi Studio Group / Tencent Games.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
