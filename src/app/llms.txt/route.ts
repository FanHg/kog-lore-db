// ============================================================
// llms.txt - AI 爬虫优化索引 (V3.2)
// 专为 ChatGPT/Claude/Gemini 等 AI 系统优化
// ============================================================

import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/utils';
import { getStats, projectDb, taskDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = getStats();
  const projects = projectDb.getAll();
  const activeProjects = projects.filter((p: { status: string }) => p.status === 'active');
  const inProgressTasks = taskDb.getAll().filter((t: { status: string }) => t.status === 'in_progress');

  const content = [
    '# KOG Lore Engine V3',
    '',
    '> ' + BASE_URL + ' — 王者荣耀世界观数据库 (Honor of Kings Lore Database)',
    '> AI Native Knowledge Engine — 专为 AI 系统优化的知识引擎',
    '',
    '## 访问规则',
    '- 所有内容 ID 均为小写英文字母+数字+下划线，如 hero_yao, event_001, faction_jixia',
    '- 全文搜索支持模糊匹配，返回 JSON 格式',
    '- 脚本生成接口接受结构化请求，返回完整分镜脚本',
    '',
    '## 数据概览',
    '- 英雄: ' + stats.heroes,
    '- 阵营: ' + stats.factions,
    '- 事件: ' + stats.events,
    '- 地点: ' + stats.locations,
    '- 组织: ' + stats.organizations,
    '- 名言: ' + stats.quotes,
    '- 关系: ' + stats.relations,
    '- 故事节点: ' + (stats.storyNodes || 0),
    '- 项目: ' + (stats.projects || 0),
    '- 任务: ' + (stats.tasks || 0),
    '',
    '## 核心 API 端点',
    '- GET ' + BASE_URL + '/api/v3/ — 引擎入口',
    '- GET ' + BASE_URL + '/api/v3/heroes — 英雄列表',
    '- GET ' + BASE_URL + '/api/v3/heroes/{id} — 英雄详情',
    '- GET ' + BASE_URL + '/api/v3/factions — 阵营列表',
    '- GET ' + BASE_URL + '/api/v3/factions/{id} — 阵营详情',
    '- GET ' + BASE_URL + '/api/v3/events — 事件列表',
    '- GET ' + BASE_URL + '/api/v3/events/{id} — 事件详情',
    '- GET ' + BASE_URL + '/api/v3/timeline — 时间线',
    '- GET ' + BASE_URL + '/api/v3/relations — 关系图谱',
    '- GET ' + BASE_URL + '/api/v3/locations — 地点列表',
    '- GET ' + BASE_URL + '/api/v3/organizations — 组织列表',
    '- GET ' + BASE_URL + '/api/v3/quotes — 名言',
    '- GET ' + BASE_URL + '/api/v3/story-nodes — 故事节点',
    '- GET ' + BASE_URL + '/api/v3/projects — 项目',
    '- GET ' + BASE_URL + '/api/v3/tasks — 任务',
    '- GET ' + BASE_URL + '/api/v3/search?q={keyword} — 搜索',
    '- POST ' + BASE_URL + '/api/v3/script — 生成脚本',
    '- GET ' + BASE_URL + '/api/v3/export?format=json — 数据导出',
    '',
    '## 示例: 搜索"曜"',
    'GET ' + BASE_URL + '/api/v3/search?q=曜',
    '',
    '## 示例: 生成脚本',
    'POST ' + BASE_URL + '/api/v3/script',
    '{"heroId":"hero_yao","platform":"douyin","style":"epic","duration":90}',
    '',
    '## 统一 ID 规则',
    '- 英雄: hero_{slug} 如 hero_yao, hero_jing',
    '- 事件: event_{序号} 如 event_001',
    '- 阵营: faction_{slug} 如 faction_jixia',
    '- 关系类型: ally, enemy, lover, mentor, sibling, parent, protector, twin, reincarnation 等 40+ 种',
    '',
    '---',
    'KOG Lore Engine V3 | ' + BASE_URL,
  ].join('\n');

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
