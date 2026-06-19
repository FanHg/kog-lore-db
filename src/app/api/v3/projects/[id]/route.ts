import { NextResponse } from 'next/server';
import { projectDb, taskDb, memoryDb, decisionDb, storyNodeDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const project = projectDb.getById(id);
    if (!project) {
      return NextResponse.json(apiError(`Project not found: ${id}`, 404), { status: 404 });
    }
    // 获取关联数据
    const tasks = taskDb.getByProjectId(id);
    const memories = memoryDb.getByProjectId(id);
    const decisions = decisionDb.getByProjectId(id);
    const storyNodes = storyNodeDb.getAll().filter(n => 
      project.seasons.some(s => 
        s.episodes.some(e => e.storyNodeIds.includes(n.id))
      )
    );
    return NextResponse.json(apiSuccess({
      ...project,
      tasks,
      memories,
      decisions,
      storyNodes,
    }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch project', 500), { status: 500 });
  }
}
