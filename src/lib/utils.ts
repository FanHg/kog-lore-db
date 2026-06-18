// ============================================================
// 通用工具函数
// Utility Functions
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RelationType } from './types';

// Tailwind class merging helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API response helper
export function apiSuccess<T>(data: T, meta?: { total?: number; page?: number; pageSize?: number }) {
  return {
    data,
    ...meta,
    timestamp: new Date().toISOString(),
  };
}

export function apiError(message: string, code = 400) {
  return {
    error: message,
    code,
    timestamp: new Date().toISOString(),
  };
}

// Relation type display
export const RELATION_LABELS: Record<RelationType, string> = {
  ally: '盟友',
  enemy: '敌人',
  lover: '恋人',
  mentor: '师父',
  student: '徒弟',
  teacher: '老师',
  sibling: '兄弟姐妹',
  parent: '父母',
  child: '子女',
  rival: '宿敌',
  neutral: '中立',
  colleague: '同僚',
  teammate: '队友',
  friend: '朋友',
  former_friend: '昔日好友',
  benefactor: '恩人',
  creator: '创造者',
  guardian: '守护者',
  comrade: '战友',
  subordinate: '下属',
  superior: '上级',
  connection: '关联',
};

export const RELATION_COLORS: Record<RelationType, string> = {
  ally: '#1A8A5A',         // jade - 友善
  enemy: '#C02030',        // crimson - 敌对
  lover: '#D44077',        // rose - 恋情
  mentor: '#D4A017',       // gold - 传承
  student: '#A07810',      // dark gold - 学习
  teacher: '#C49018',      // warm gold - 师长
  sibling: '#2A7AAA',      // azure - 家庭
  parent: '#1A5A8A',       // dark azure - 亲情
  child: '#3A8ABB',        // light azure - 亲情
  rival: '#A03080',        // purple - 对立
  neutral: '#6A7080',      // gray - 中立
  colleague: '#5A8A6A',    // sage green - 同僚
  teammate: '#2A9A7A',     // teal - 队友
  friend: '#3A9A5A',       // green - 友情
  former_friend: '#8A6A5A', // muted brown - 昔日
  benefactor: '#C49018',   // amber - 恩情
  creator: '#7A50B0',      // violet - 创造
  guardian: '#3A6AAA',     // steel blue - 守护
  comrade: '#5A7AAA',      // navy blue - 战友
  subordinate: '#6A8A7A',  // muted teal - 下属
  superior: '#5A7A9A',     // slate blue - 上级
  connection: '#8A8A8A',   // medium gray - 关联
};

// Role display
export const ROLE_LABELS: Record<string, string> = {
  '战士': 'Fighter',
  '法师': 'Mage',
  '射手': 'Marksman',
  '刺客': 'Assassin',
  '坦克': 'Tank',
  '辅助': 'Support',
};

export const ROLE_COLORS: Record<string, string> = {
  '战士': '#C05000',
  '法师': '#6020C0',
  '射手': '#208060',
  '刺客': '#804080',
  '坦克': '#204080',
  '辅助': '#208090',
};

// Difficulty display
export function getDifficultyLabel(diff: 1 | 2 | 3): string {
  return ['简单', '中等', '困难'][diff - 1];
}

export function getDifficultyColor(diff: 1 | 2 | 3): string {
  return ['#1A8A5A', '#D4A017', '#C02030'][diff - 1];
}

// Faction status display
export const FACTION_STATUS_LABELS: Record<string, string> = {
  active: '活跃',
  destroyed: '已灭亡',
  merged: '已合并',
  dormant: '沉寂',
  unknown: '未知',
};

// Event type display
export const EVENT_TYPE_LABELS: Record<string, string> = {
  battle: '战役',
  political: '政治事件',
  divine: '神祇事件',
  personal: '个人故事',
  founding: '建国/建立',
  catastrophe: '灾难',
};

// Formatting
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncate(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Environment
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

// Site config
export const SITE_CONFIG = {
  name: '王者荣耀世界观数据库',
  nameEn: 'Honor of Kings Lore Database',
  description:
    '王者荣耀官方世界观数据库，收录全英雄背景故事、阵营关系、历史事件、世界地理与时间线。完全公开，支持API调用。',
  url: BASE_URL,
  keywords: ['王者荣耀', '世界观', '英雄故事', '背景故事', '阵营', '时间线', 'Honor of Kings', 'KOG Lore'],
  author: 'KOG Lore DB',
  twitterHandle: '@KOGLoreDB',
};

// ============================================================
// Auto-link lore content: replace hero/faction names with <a> links
// ============================================================

/**
 * Build a regex that matches hero/faction names in HTML text,
 * but NOT inside existing <a> tags or HTML attributes.
 * Names are sorted by length descending to match longer names first.
 */
export function autoLinkLoreContent(
  html: string,
  heroNames: { id: string; name: string }[],
  factionNames: { id: string; name: string }[],
): string {
  // Collect all names with their link targets
  const entries: { name: string; replacement: string }[] = [
    ...heroNames.map(h => ({
      name: h.name,
      replacement: `<a href="/heroes/${h.id}" class="text-gold hover:text-gold-light underline underline-offset-2 decoration-gold/40 hover:decoration-gold transition-colors">${h.name}</a>`,
    })),
    ...factionNames.map(f => ({
      name: f.name,
      replacement: `<a href="/factions/${f.id}" class="text-gold hover:text-gold-light underline underline-offset-2 decoration-gold/40 hover:decoration-gold transition-colors">${f.name}</a>`,
    })),
  ];

  // Sort by name length descending to avoid partial matches
  entries.sort((a, b) => b.name.length - a.name.length);

  let result = html;

  for (const entry of entries) {
    // Escape special regex characters in the name
    const escaped = entry.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match the name only when it's NOT already inside an <a> tag
    // Negative lookbehind for "> and negative lookahead for <
    // This is a simplified approach: we process text nodes by
    // temporarily protecting <a> content
    const regex = new RegExp(`(?![^<]*>)(?!<a[^>]*>)${escaped}`, 'g');
    
    // More robust: use a callback to skip replacements inside tags
    result = result.replace(regex, entry.replacement);
  }

  return result;
}

/**
 * Safer version: process text nodes only by parsing with DOM-like approach.
 * For use in server components where we can't use DOM APIs,
 * we use a simple tag-aware replacement.
 */
export function linkifyLoreHtml(
  html: string,
  heroNames: { id: string; name: string }[],
  factionNames: { id: string; name: string }[],
): string {
  // Build replacement map sorted by length desc
  const entries = [
    ...heroNames.map(h => ({ name: h.name, replace: `<a href="/heroes/${h.id}" class="text-gold hover:text-gold-light underline underline-offset-2 decoration-gold/40 hover:decoration-gold transition-colors">${h.name}</a>` })),
    ...factionNames.map(f => ({ name: f.name, replace: `<a href="/factions/${f.id}" class="text-gold hover:text-gold-light underline underline-offset-2 decoration-gold/40 hover:decoration-gold transition-colors">${f.name}</a>` })),
  ].sort((a, b) => b.name.length - a.name.length);

  // Split by HTML tags, only process text segments
  // Pattern: capture either an HTML tag or a text segment
  const tokenPattern = /(<\/?[^>]+>)/g;
  const tokens = html.split(tokenPattern);

  const processed = tokens.map(token => {
    // If this token is an HTML tag, don't process it
    if (/^<\/?[^>]+>$/.test(token)) return token;
    // Process text token: replace names with links
    let text = token;
    for (const entry of entries) {
      // Skip very short names (<=1 char) to avoid noise
      if (entry.name.length <= 1) continue;
      const regex = new RegExp(`(?![^<]*>)${escapeRegex(entry.name)}`, 'g');
      text = text.replace(regex, entry.replace);
    }
    return text;
  });

  return processed.join('');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
