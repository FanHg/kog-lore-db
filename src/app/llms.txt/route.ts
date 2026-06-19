// ============================================================
// llms.txt - AI 爬虫优化索引 (V3.1)
// 专为 ChatGPT/Claude/Gemini 等 AI 系统优化
// 2026-06-19: 修复类型编译错误，强制 Vercel 重新构建
// ============================================================

import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/utils';
import { getStats, projectDb, taskDb, memoryDb, decisionDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = getStats();
  const projects = projectDb.getAll();
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedTasks = taskDb.getAll().filter(t => t.status === 'completed');
  const inProgressTasks = taskDb.getAll().filter(t => t.status === 'in_progress');
  
  const content = `# KOG Lore Engine V3

> ${BASE_URL} — 王者荣耀世界观数据库 (Honor of Kings Lore Database)
> AI Native Knowledge Engine — 专为 AI 系统优化的知识引擎

## 访问规则
- 所有内容 ID 均为小写英文字母+数字+下划线，如 hero_yao, event_001, faction_jixia
- 全文搜索支持模糊匹配，返回 JSON 格式
- 脚本生成接口接受结构化请求，返回完整分镜脚本
- 所有数据使用 ISO 8601 时间格式

## 数据概览

- 英雄: ${stats.heroes}
- 阵营: ${stats.factions}
- 事件: ${stats.events}
- 地点: ${stats.locations}
- 组织: ${stats.organizations}
- 名言: ${stats.quotes}
- 关系: ${stats.relations}
- 故事节点: ${stats.storyNodes}
- 项目: ${stats.projects}
- 任务: ${stats.tasks}
- 记忆: ${stats.memories}
- 决策: ${stats.decisions}
- Prompt: ${stats.prompts}

## 活跃项目
${activeProjects.map(p => `- [${p.id}] ${p.name}: ${p.description} (状态: ${p.status})`).join('\n') || '- 无活跃项目'}

## 进行中的任务
${inProgressTasks.map(t => `- [${t.id}] ${t.name}: ${t.description} (优先级: ${t.priority})`).join('\n') || '- 无进行中任务'}

## 核心 API 端点

### 数据查询
- GET ${BASE_URL}/api/v3/ — 引擎入口，返回所有端点列表
- GET ${BASE_URL}/api/v3/heroes — 全部英雄列表
- GET ${BASE_URL}/api/v3/heroes/{id} — 单个英雄详情
- GET ${BASE_URL}/api/v3/factions — 全部阵营列表
- GET ${BASE_URL}/api/v3/factions/{id} — 单个阵营详情
- GET ${BASE_URL}/api/v3/events — 全部事件列表
- GET ${BASE_URL}/api/v3/events/{id} — 单个事件详情
- GET ${BASE_URL}/api/v3/timeline — 时间线数据
- GET ${BASE_URL}/api/v3/relations — 关系图谱
- GET ${BASE_URL}/api/v3/locations — 全部地点列表
- GET ${BASE_URL}/api/v3/organizations — 全部组织列表
- GET ${BASE_URL}/api/v3/quotes — 全部名言
- GET ${BASE_URL}/api/v3/story-nodes — 全部故事节点
- GET ${BASE_URL}/api/v3/projects — 全部项目
- GET ${BASE_URL}/api/v3/tasks — 全部任务
- GET ${BASE_URL}/api/v3/memories — 全部记忆
- GET ${BASE_URL}/api/v3/decisions — 全部决策
- GET ${BASE_URL}/api/v3/prompts — 全部 Prompt 记录

### 搜索与生成
- GET ${BASE_URL}/api/v3/search?q={keyword} — 全文搜索（跨英雄/阵营/事件/地点/名言/故事节点/项目/任务）
- POST ${BASE_URL}/api/v3/script — 生成短剧脚本
- GET ${BASE_URL}/api/v3/export?format={graph|json} — 数据导出

### 示例: 搜索"曜"
GET ${BASE_URL}/api/v3/search?q=曜
→ 返回所有与"曜"相关的英雄、事件、故事节点、项目

### 示例: 生成脚本
POST ${BASE_URL}/api/v3/script
Content-Type: application/json

{
  "heroId": "hero_yao",
  "platform": "douyin",
  "style": "epic",
  "duration": 90,
  "focusEvents": ["event_001", "event_002"],
  "toneNotes": "燃向，强调曜镜姐弟羁绊",
  "bgmPreference": "史诗感电子+古风弦乐"
}
→ 返回完整 4 幕脚本结构（opening/rising/climax/ending），包含镜头、BGM、字幕、旁白

## 数据格式规范

### 统一 ID 命名规则
- 英雄: hero_{slug} 如 hero_yao, hero_jing, hero_miyamoto
- 事件: event_{序号} 如 event_001, event_002
- 阵营: faction_{slug} 如 faction_jixia, faction_changan
- 地点: location_{slug} 如 location_jixia_academy
- 关系: relation_{序号} 如 relation_0001
- 项目: project_{slug} 如 project_kpl_short_drama
- 任务: task_{slug} 如 task_hero_yao_lore
- 故事节点: story_node_{序号} 如 story_node_001

### 关系类型
基础: ally, enemy, lover, mentor, student, sibling, parent, child, rival, friend, teammate, colleague
高级: protector, twin, reincarnation, soulmate, clone, nemesis, betrayer, master, servant, fused
完整类型列表见 API: GET ${BASE_URL}/api/v3/

## AI 使用指南
1. 先调用 /api/v3/ 获取数据概览和可用端点
2. 使用 /api/v3/search?q= 进行全文搜索定位实体
3. 使用 /api/v3/heroes/{id} 等获取完整数据
4. 使用 /api/v3/script 生成内容脚本
5. 使用 /api/v3/export 导出全量数据用于离线分析

## 项目示例: KPL官方AI短剧
项目 ID: project_kpl_short_drama
类型: short_drama
平台: 抖音/视频号/B站/快手/小红书
内容: 基于王者荣耀官方世界观自动生成短剧脚本
第一季主题: 稷下少年（S1）
- S01E01: 曜镜初逢 · 命运的镜
- S01E02: 镜入魔道 · 守护者的代价
- S01E03: 曜觉醒 · 星辰之子
每集 90 秒，燃向风格，含分镜/BGM/字幕/旁白

## 当前任务状态
- 已完成: 整理曜英雄全部剧情节点
- 已完成: 整理镜英雄全部剧情节点
- 进行中: 生成第三季脚本（基于前两季数据）

## 记忆 & 决策
- 事实记忆: 曜与镜为姐弟关系，镜为守护者，曜为星辰之子
- 项目规则: 采用官方世界观，不添加 IF 线
- 平台规则: 单集 90 秒内，优先抖音平台
- 决策记录: 第一季采用官方世界观，不加 IF 线；单集 90 秒优先抖音

---
KOG Lore Engine V3 | ${BASE_URL} | 王者荣耀世界观数据库
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
