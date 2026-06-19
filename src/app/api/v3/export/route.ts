import { NextResponse } from 'next/server';
import { getStats, heroDb, factionDb, eventDb, relationDb, locationDb, organizationDb, quoteDb, projectDb, taskDb, memoryDb, decisionDb, promptDb, storyNodeDb, dialogueDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    
    const stats = getStats();
    
    const data = {
      meta: {
        name: 'KOG Lore Engine V3',
        version: '3.0.0',
        exportedAt: new Date().toISOString(),
        stats,
      },
      heroes: heroDb.getAll(),
      factions: factionDb.getAll(),
      events: eventDb.getAll(),
      locations: locationDb.getAll(),
      organizations: organizationDb.getAll(),
      quotes: quoteDb.getAll(),
      relations: relationDb.getAll(),
      storyNodes: storyNodeDb.getAll(),
      dialogues: dialogueDb.getAll(),
      projects: projectDb.getAll(),
      tasks: taskDb.getAll(),
      memories: memoryDb.getAll(),
      decisions: decisionDb.getAll(),
      prompts: promptDb.getAll(),
    };
    
    if (format === 'graph') {
      // 返回图谱格式，适合可视化工具
      const graph = relationDb.getGraphData();
      const allHeroes = heroDb.getAll();
      const allFactions = factionDb.getAll();
      const allLocations = locationDb.getAll();
      
      const nodes = [
        ...graph.nodes,
        ...allFactions.map(f => ({ id: f.id, name: f.name, type: 'faction' as const, group: f.id })),
        ...allLocations.map(l => ({ id: l.id, name: l.name, type: 'location' as const, group: l.faction || 'unknown' })),
      ];
      
      return NextResponse.json(apiSuccess({
        ...data.meta,
        graph: {
          nodes,
          edges: graph.edges,
        },
      }));
    }
    
    return NextResponse.json(apiSuccess(data));
  } catch (err) {
    return NextResponse.json(apiError('Failed to export data', 500), { status: 500 });
  }
}
