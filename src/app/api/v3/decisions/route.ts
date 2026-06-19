import { NextResponse } from 'next/server';
import { decisionDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    let decisions = decisionDb.getAll();
    if (projectId) {
      decisions = decisions.filter(d => d.projectId === projectId);
    }
    return NextResponse.json(apiSuccess(decisions, { total: decisions.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch decisions', 500), { status: 500 });
  }
}
