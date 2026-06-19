import { NextResponse } from 'next/server';
import { taskDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';
import type { Task } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status') as Task['status'] | null;
    let tasks = taskDb.getAll();
    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId);
    }
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    return NextResponse.json(apiSuccess(tasks, { total: tasks.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch tasks', 500), { status: 500 });
  }
}
