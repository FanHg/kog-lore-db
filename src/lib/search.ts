// ============================================================
// 全文搜索工具 - 基于 Fuse.js 的模糊搜索
// Full-text Search - Fuse.js Based Fuzzy Search
// ============================================================

import Fuse from 'fuse.js';
import { buildSearchIndex } from './db';
import type { SearchResult } from './types';

interface SearchIndexItem {
  type: string;
  id: string;
  name: string;
  description: string;
  url: string;
  tags?: string[];
  searchText: string;
}

let fuseInstance: Fuse<SearchIndexItem> | null = null;
let lastIndexTime = 0;
const INDEX_TTL = 60 * 1000; // 1 minute cache

function getFuse(): Fuse<SearchIndexItem> {
  const now = Date.now();
  if (!fuseInstance || now - lastIndexTime > INDEX_TTL) {
    const index = buildSearchIndex() as SearchIndexItem[];
    fuseInstance = new Fuse(index, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'searchText', weight: 0.4 },
        { name: 'tags', weight: 0.2 },
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 1,
      useExtendedSearch: false,
    });
    lastIndexTime = now;
  }
  return fuseInstance;
}

export function search(query: string, limit = 20): SearchResult[] {
  if (!query || query.trim().length === 0) return [];

  const fuse = getFuse();
  const results = fuse.search(query.trim(), { limit });

  return results.map(result => ({
    type: result.item.type,
    id: result.item.id,
    name: result.item.name,
    description: result.item.description,
    url: result.item.url,
    tags: result.item.tags,
    score: result.score,
  })) as SearchResult[];
}

export function searchByType(
  query: string,
  type: SearchResult['type'],
  limit = 20
): SearchResult[] {
  return search(query, limit * 2)
    .filter(r => r.type === type)
    .slice(0, limit);
}

export function invalidateSearchCache() {
  fuseInstance = null;
  lastIndexTime = 0;
}
