import { NextResponse } from 'next/server';
import { promptDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const type = searchParams.get('type') as PromptEntry['type'] | null;
    let prompts = promptDb.getAll();
    if (projectId) {
      prompts = prompts.filter(p => p.projectId === projectId);
    }
    if (type) {
      prompts = prompts.filter(p => p.type === type);
    }
    return NextResponse.json(apiSuccess(prompts, { total: prompts.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch prompts', 500), { status: 500 });
  }
}
