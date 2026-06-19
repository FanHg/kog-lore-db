import { NextResponse } from 'next/server';
import { relationDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const relations = relationDb.getAll();
    const graph = relationDb.getGraphData();
    return NextResponse.json(apiSuccess({
      relations,
      graph,
      total: relations.length,
      nodes: graph.nodes.length,
      edges: graph.edges.length,
    }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch relations', 500), { status: 500 });
  }
}
