import { NextResponse } from 'next/server';
import { projectDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = projectDb.getAll();
    return NextResponse.json(apiSuccess(projects, { total: projects.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch projects', 500), { status: 500 });
  }
}
