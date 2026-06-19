// ============================================================
// 数据库工具层 - 读取 JSON 文件作为数据库 (V3)
// Database Utility Layer - JSON File System Database (V3)
// ============================================================

import fs from 'fs';
import path from 'path';
import type {
  Hero, Faction, LoreEvent, TimelineEntry, Relation,
  Location, Organization, Quote, VideoTopic, GraphData, GraphEdge, GraphNode,
  // V3 types
  StoryNode, Dialogue, Region, LoreItem, VideoEntry, HeroSkill,
  Memory, ConversationEntry, Decision, PromptEntry, Project, Task
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

// ---------- 通用读取工具 ----------

function readJsonFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function readJsonDir<T>(dirPath: string): T[] {
  try {
    if (!fs.existsSync(dirPath)) return [];
    const files = fs.readdirSync(dirPath);
    return files
      .filter(f => f.endsWith('.json') && f !== 'index.json')
      .map(f => readJsonFile<T>(path.join(dirPath, f)))
      .filter((item): item is T => item !== null);
  } catch {
    return [];
  }
}

function readIndexFile<T>(dirPath: string): T[] {
  const indexPath = path.join(dirPath, 'index.json');
  if (fs.existsSync(indexPath)) {
    const data = readJsonFile<T[]>(indexPath);
    return data || [];
  }
  return readJsonDir<T>(dirPath);
}

function readV3Dir<T>(subPath: string): T[] {
  const dirPath = path.join(DATA_DIR, 'v3', subPath);
  return readIndexFile<T>(dirPath);
}

// ---------- 英雄 Heroes ----------

export const heroDb = {
  getAll(): Hero[] {
    return readJsonDir<Hero>(path.join(DATA_DIR, 'heroes'))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  },
  getById(id: string): Hero | null {
    return readJsonFile<Hero>(path.join(DATA_DIR, 'heroes', `${id}.json`));
  },
  getByName(name: string): Hero | null {
    return this.getAll().find(h => h.name === name) || null;
  },
  getByFaction(factionId: string): Hero[] {
    return this.getAll().filter(h => h.faction === factionId);
  },
  getByRole(role: string): Hero[] {
    return this.getAll().filter(h => h.role.includes(role as never));
  },
  getAllIds(): string[] {
    try {
      const dir = path.join(DATA_DIR, 'heroes');
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir)
        .filter(f => f.endsWith('.json') && f !== 'index.json')
        .map(f => f.replace('.json', ''));
    } catch {
      return [];
    }
  },
};

// ---------- 阵营 Factions ----------

export const factionDb = {
  getAll(): Faction[] {
    return readJsonDir<Faction>(path.join(DATA_DIR, 'factions'))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  },
  getById(id: string): Faction | null {
    return readJsonFile<Faction>(path.join(DATA_DIR, 'factions', `${id}.json`));
  },
  getAllIds(): string[] {
    try {
      const dir = path.join(DATA_DIR, 'factions');
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir)
        .filter(f => f.endsWith('.json') && f !== 'index.json')
        .map(f => f.replace('.json', ''));
    } catch {
      return [];
    }
  },
};

// ---------- 事件 Events ----------

export const eventDb = {
  getAll(): LoreEvent[] {
    return readJsonDir<LoreEvent>(path.join(DATA_DIR, 'events'));
  },
  getById(id: string): LoreEvent | null {
    return readJsonFile<LoreEvent>(path.join(DATA_DIR, 'events', `${id}.json`));
  },
  getByParticipant(heroId: string): LoreEvent[] {
    return this.getAll().filter(e => e.participants.includes(heroId));
  },
  getAllIds(): string[] {
    try {
      const dir = path.join(DATA_DIR, 'events');
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir)
        .filter(f => f.endsWith('.json') && f !== 'index.json')
        .map(f => f.replace('.json', ''));
    } catch {
      return [];
    }
  },
};

// ---------- 时间线 Timeline ----------

export const timelineDb = {
  getAll(): TimelineEntry[] {
    const data = readIndexFile<TimelineEntry>(path.join(DATA_DIR, 'timeline'));
    return data.sort((a, b) => a.order - b.order);
  },
};

// ---------- 关系 Relations ----------

export const relationDb = {
  getAll(): Relation[] {
    return readIndexFile<Relation>(path.join(DATA_DIR, 'relations'));
  },
  getByHeroId(heroId: string): Relation[] {
    return this.getAll().filter(r => r.sourceId === heroId || r.targetId === heroId);
  },
  getGraphData(): GraphData {
    const heroes = heroDb.getAll();
    const relations = this.getAll();

    const nodes: GraphNode[] = heroes.map(h => ({
      id: h.id,
      name: h.name,
      type: 'hero' as const,
      group: h.faction,
    }));

    const edges: GraphEdge[] = relations.map(r => ({
      source: r.sourceId,
      target: r.targetId,
      type: r.type,
      label: r.description || '',
      strength: r.strength || 0.5,
    }));

    return { nodes, edges };
  },
};

// ---------- 地点 Locations ----------

export const locationDb = {
  getAll(): Location[] {
    return readJsonDir<Location>(path.join(DATA_DIR, 'locations'));
  },
  getById(id: string): Location | null {
    return readJsonFile<Location>(path.join(DATA_DIR, 'locations', `${id}.json`));
  },
  getAllIds(): string[] {
    try {
      const dir = path.join(DATA_DIR, 'locations');
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir)
        .filter(f => f.endsWith('.json') && f !== 'index.json')
        .map(f => f.replace('.json', ''));
    } catch {
      return [];
    }
  },
};

// ---------- 组织 Organizations ----------

export const organizationDb = {
  getAll(): Organization[] {
    return readIndexFile<Organization>(path.join(DATA_DIR, 'organizations'));
  },
  getById(id: string): Organization | null {
    return this.getAll().find(o => o.id === id) || null;
  },
};

// ---------- 名言 Quotes ----------

export const quoteDb = {
  getAll(): Quote[] {
    return readIndexFile<Quote>(path.join(DATA_DIR, 'quotes'));
  },
  getByHeroId(heroId: string): Quote[] {
    return this.getAll().filter(q => q.heroId === heroId);
  },
};

// ---------- 视频话题 Video Topics ----------

export const videoTopicDb = {
  getAll(): VideoTopic[] {
    return readIndexFile<VideoTopic>(path.join(DATA_DIR, 'video-topics'));
  },
  getById(id: string): VideoTopic | null {
    return this.getAll().find(t => t.id === id) || null;
  },
};

// ============================================================
// V3 新增数据库层
// ============================================================

// ---------- 地域 Regions ----------
export const regionDb = {
  getAll(): Region[] {
    return readV3Dir<Region>('region');
  },
  getById(id: string): Region | null {
    return readJsonFile<Region>(path.join(DATA_DIR, 'v3', 'region', `${id}.json`))
      || this.getAll().find(r => r.id === id) || null;
  },
};

// ---------- 故事节点 Story Nodes ----------
export const storyNodeDb = {
  getAll(): StoryNode[] {
    return readV3Dir<StoryNode>('story-node');
  },
  getById(id: string): StoryNode | null {
    return this.getAll().find(n => n.id === id) || null;
  },
  getByEventId(eventId: string): StoryNode[] {
    return this.getAll().filter(n => n.eventId === eventId);
  },
  getByHeroId(heroId: string): StoryNode[] {
    return this.getAll().filter(n => n.characters.includes(heroId));
  },
};

// ---------- 对话 Dialogues ----------
export const dialogueDb = {
  getAll(): Dialogue[] {
    return readV3Dir<Dialogue>('dialogue');
  },
  getById(id: string): Dialogue | null {
    return this.getAll().find(d => d.id === id) || null;
  },
  getByHeroId(heroId: string): Dialogue[] {
    return this.getAll().filter(d => d.heroId === heroId || d.targetId === heroId);
  },
};

// ---------- 项目 Projects ----------
export const projectDb = {
  getAll(): Project[] {
    return readV3Dir<Project>('project');
  },
  getById(id: string): Project | null {
    return this.getAll().find(p => p.id === id) || null;
  },
  getByType(type: string): Project[] {
    return this.getAll().filter(p => p.type === type);
  },
};

// ---------- 任务 Tasks ----------
export const taskDb = {
  getAll(): Task[] {
    return readV3Dir<Task>('task');
  },
  getById(id: string): Task | null {
    return this.getAll().find(t => t.id === id) || null;
  },
  getByProjectId(projectId: string): Task[] {
    return this.getAll().filter(t => t.projectId === projectId);
  },
  getByStatus(status: Task['status']): Task[] {
    return this.getAll().filter(t => t.status === status);
  },
};

// ---------- 记忆 Memories ----------
export const memoryDb = {
  getAll(): Memory[] {
    return readV3Dir<Memory>('memory');
  },
  getById(id: string): Memory | null {
    return this.getAll().find(m => m.id === id) || null;
  },
  getByProjectId(projectId: string): Memory[] {
    return this.getAll().filter(m => m.projectId === projectId);
  },
  getByHeroId(heroId: string): Memory[] {
    return this.getAll().filter(m => m.heroIds?.includes(heroId) || false);
  },
};

// ---------- 决策 Decisions ----------
export const decisionDb = {
  getAll(): Decision[] {
    return readV3Dir<Decision>('decision');
  },
  getById(id: string): Decision | null {
    return this.getAll().find(d => d.id === id) || null;
  },
  getByProjectId(projectId: string): Decision[] {
    return this.getAll().filter(d => d.projectId === projectId);
  },
};

// ---------- Prompt 记录 Prompts ----------
export const promptDb = {
  getAll(): PromptEntry[] {
    return readV3Dir<PromptEntry>('prompt');
  },
  getById(id: string): PromptEntry | null {
    return this.getAll().find(p => p.id === id) || null;
  },
  getByProjectId(projectId: string): PromptEntry[] {
    return this.getAll().filter(p => p.projectId === projectId);
  },
  getByType(type: PromptEntry['type']): PromptEntry[] {
    return this.getAll().filter(p => p.type === type);
  },
};

// ---------- 全局统计 ----------

export function getStats() {
  return {
    heroes: heroDb.getAll().length,
    factions: factionDb.getAll().length,
    events: eventDb.getAll().length,
    locations: locationDb.getAll().length,
    organizations: organizationDb.getAll().length,
    quotes: quoteDb.getAll().length,
    videoTopics: videoTopicDb.getAll().length,
    relations: relationDb.getAll().length,
    // V3 stats
    regions: regionDb.getAll().length,
    storyNodes: storyNodeDb.getAll().length,
    dialogues: dialogueDb.getAll().length,
    projects: projectDb.getAll().length,
    tasks: taskDb.getAll().length,
    memories: memoryDb.getAll().length,
    decisions: decisionDb.getAll().length,
    prompts: promptDb.getAll().length,
  };
}

// ---------- 构建全文搜索索引 ----------

export function buildSearchIndex() {
  const heroes = heroDb.getAll().map(h => ({
    type: 'hero' as const,
    id: h.id,
    name: h.name,
    description: h.description,
    url: `/heroes/${h.id}`,
    tags: h.tags,
    searchText: `${h.name} ${h.title} ${h.alias?.join(' ') || ''} ${h.factionName || ''} ${h.energy || ''} ${h.identity || ''} ${h.description} ${h.tags.join(' ')}`,
  }));

  const factions = factionDb.getAll().map(f => ({
    type: 'faction' as const,
    id: f.id,
    name: f.name,
    description: f.description,
    url: `/factions/${f.id}`,
    tags: f.tags,
    searchText: `${f.name} ${f.description} ${f.tags.join(' ')}`,
  }));

  const events = eventDb.getAll().map(e => ({
    type: 'event' as const,
    id: e.id,
    name: e.name,
    description: e.description,
    url: `/events/${e.id}`,
    tags: e.tags,
    searchText: `${e.name} ${e.era} ${e.description} ${e.tags.join(' ')}`,
  }));

  const locations = locationDb.getAll().map(l => ({
    type: 'location' as const,
    id: l.id,
    name: l.name,
    description: l.description,
    url: `/locations/${l.id}`,
    tags: l.tags,
    searchText: `${l.name} ${l.description} ${l.tags.join(' ')}`,
  }));

  return [...heroes, ...factions, ...events, ...locations];
}

// V3: 扩展搜索索引包含 storyNodes 和 projects
export function buildV3SearchIndex() {
  const base = buildSearchIndex();
  
  const storyNodes = storyNodeDb.getAll().map(n => ({
    type: 'storyNode' as const,
    id: n.id,
    name: n.title,
    description: n.impact,
    url: `/api/v3/story-nodes/${n.id}`,
    tags: n.tags,
    searchText: `${n.title} ${n.action} ${n.cause} ${n.impact} ${n.result} ${n.tags.join(' ')}`,
  }));

  const projects = projectDb.getAll().map(p => ({
    type: 'project' as const,
    id: p.id,
    name: p.name,
    description: p.description,
    url: `/api/v3/projects/${p.id}`,
    tags: p.tags,
    searchText: `${p.name} ${p.description} ${p.tags.join(' ')}`,
  }));

  const tasks = taskDb.getAll().map(t => ({
    type: 'task' as const,
    id: t.id,
    name: t.name,
    description: t.description,
    url: `/api/v3/tasks/${t.id}`,
    tags: t.tags,
    searchText: `${t.name} ${t.description} ${t.tags.join(' ')}`,
  }));

  const dialogues = dialogueDb.getAll().map(d => ({
    type: 'dialogue' as const,
    id: d.id,
    name: `${d.heroId}台词`,
    description: d.text.slice(0, 100),
    url: `/api/v3/dialogues/${d.id}`,
    tags: d.tags,
    searchText: `${d.text} ${d.context} ${d.tags.join(' ')}`,
  }));

  return [...base, ...storyNodes, ...projects, ...tasks, ...dialogues];
}
