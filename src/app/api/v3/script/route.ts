import { NextResponse } from 'next/server';
import { heroDb, storyNodeDb, eventDb } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/utils';
import type { ScriptRequest, ScriptOutput, ScriptScene } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body: ScriptRequest = await request.json();
    const { heroId, platform, style, duration, focusEvents, focusRelations, toneNotes, bgmPreference } = body;
    
    if (!heroId || !platform || !style || !duration) {
      return NextResponse.json(apiError('Missing required fields: heroId, platform, style, duration', 400), { status: 400 });
    }
    
    const hero = heroDb.getById(heroId);
    if (!hero) {
      return NextResponse.json(apiError(`Hero not found: ${heroId}`, 404), { status: 404 });
    }
    
    // 获取相关故事节点
    let nodes = storyNodeDb.getByHeroId(heroId);
    if (focusEvents && focusEvents.length > 0) {
      nodes = nodes.filter(n => focusEvents.includes(n.eventId || ''));
    }
    if (nodes.length === 0) {
      nodes = storyNodeDb.getAll().slice(0, 4); // 默认取前4个节点
    }
    
    // 按时间线排序
    nodes.sort((a, b) => a.timelinePosition - b.timelinePosition);
    
    // 分配时长到4幕
    const sceneDuration = Math.floor(duration / 4);
    const scenes: ScriptScene[] = [
      {
        id: `${heroId}_s01`,
        order: 1,
        title: '第一幕：引子',
        duration: sceneDuration,
        type: 'opening',
        content: `${hero.name}登场。${hero.description.slice(0, 80)}`,
        characters: [hero.name],
        bgm: bgmPreference || '史诗感电子+古风弦乐',
        sfx: ['风声', '远处战鼓'],
        subtitle: `${hero.title} · ${hero.name}`,
        voiceover: `在王者荣耀的世界里，${hero.name}，${hero.description.slice(0, 60)}...`,
      },
      {
        id: `${heroId}_s02`,
        order: 2,
        title: '第二幕：冲突',
        duration: sceneDuration,
        type: 'rising',
        content: nodes[0] ? `${nodes[0].title}。${nodes[0].action}。${nodes[0].cause}` : '命运齿轮开始转动...',
        characters: nodes[0]?.characters.map(id => heroDb.getById(id)?.name || id) || [hero.name],
        location: nodes[0]?.location,
        sfx: ['紧张鼓点', '金属碰撞'],
        subtitle: nodes[0]?.title || '命运转折',
        voiceover: nodes[0] ? `${nodes[0].cause}...` : '',
      },
      {
        id: `${heroId}_s03`,
        order: 3,
        title: '第三幕：高潮',
        duration: sceneDuration,
        type: 'climax',
        content: nodes[1] ? `${nodes[1].title}。${nodes[1].impact}。${nodes[1].result}` : '决战时刻...',
        characters: nodes[1]?.characters.map(id => heroDb.getById(id)?.name || id) || [hero.name],
        location: nodes[1]?.location,
        sfx: ['爆炸', '雷鸣', 'BGM高潮'],
        subtitle: nodes[1]?.title || '巅峰对决',
        voiceover: nodes[1] ? `那一刻，${nodes[1].impact}...` : '',
      },
      {
        id: `${heroId}_s04`,
        order: 4,
        title: '第四幕：余韵',
        duration: duration - sceneDuration * 3,
        type: 'ending',
        content: nodes[2] ? `${nodes[2].title}。${nodes[2].result}` : '故事未完待续...',
        characters: nodes[2]?.characters.map(id => heroDb.getById(id)?.name || id) || [hero.name],
        sfx: ['渐弱音乐', '风声'],
        subtitle: `关注 · 了解更多${hero.name}的故事`,
        voiceover: `${hero.name}的故事，才刚刚开始...`,
      },
    ];
    
    const output: ScriptOutput = {
      id: `script_${heroId}_${Date.now()}`,
      request: body,
      title: `${hero.name} · ${style === 'epic' ? '史诗' : style === 'emotional' ? '情感' : style === 'comedic' ? '喜剧' : style === 'mysterious' ? '悬疑' : '动作'}短篇 — ${nodes[0]?.title || '命运之章'}`,
      hook: `${hero.title} · ${hero.name} — ${hero.description.slice(0, 50)}... 你，准备好了吗？`,
      scenes,
      totalDuration: scenes.reduce((sum, s) => sum + s.duration, 0),
      suggestedBgm: bgmPreference || '史诗感电子+古风弦乐',
      suggestedTags: [hero.name, '王者荣耀', '世界观', '剧情', style === 'epic' ? '燃向' : style, `#${hero.name}`],
      suggestedTitle: [
        `${hero.name}：${nodes[0]?.title || '不为人知的故事'}`,
        `${hero.title} ${hero.name} | 90秒看懂TA的一生`,
        `当${hero.name}拿起武器的那一刻...`,
      ],
      platform,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(apiSuccess(output));
  } catch (err) {
    console.error('Script generation error:', err);
    return NextResponse.json(apiError('Failed to generate script', 500), { status: 500 });
  }
}
