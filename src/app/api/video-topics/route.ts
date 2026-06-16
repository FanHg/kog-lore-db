import { NextResponse } from 'next/server';
import { videoTopicDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const topics = videoTopicDb.getAll();
    return NextResponse.json(apiSuccess(topics, { total: topics.length }));
  } catch (err) {
    return NextResponse.json(apiError('Failed to fetch video topics', 500), { status: 500 });
  }
}
