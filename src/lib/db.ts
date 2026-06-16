// ============================================================
// 数据库工具层 - 读取 JSON 文件作为数据库
// Database Utility Layer - JSON File System Database
// ============================================================

import fs from 'fs';
import path from 'path';
import type {
  Hero, Faction, LoreEvent, TimelineEntry, Relation,
  Location, Organization, Quote, VideoTopic, GraphData, GraphEdge, GraphNode
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

// ---------- 英雄 Heroes ----------

export const heroDb = {
  getAll(): Hero[] {
    return readJsonDir<Hero>(path.join(DATA_DIR, 'heroes'))
      .sort((a, b) => a.name.localeCompare(b.name, 'zh'));
  },
  getById(id: string): Hero | null {
    return readJsonFile<Hero>(path.join(DATA_DIR, 'heroes', `${id}.json`));
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
      label: r.description,
      strength: r.strength,
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
    searchText: `${h.name} ${h.title} ${h.alias?.join(' ')} ${h.description} ${h.tags.join(' ')}`,
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
