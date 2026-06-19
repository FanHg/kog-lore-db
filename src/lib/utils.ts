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

// API response helper — accepts flexible metadata for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiSuccess<T>(data: T, meta?: Record<string, any>) {
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

// Relation type display — use string key for flexibility with V3 extended types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RELATION_LABELS: Record<string, string> = {
  // 基础关系 (21)
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
  // V3 新增关系 (30)
  protector: '保护者',
  protected: '被保护者',
  twin: '双胞胎',
  spouse: '配偶',
  ex_lover: '前恋人',
  adopted: '养子/养女',
  adoptive_parent: '养父母',
  master: '主人',
  servant: '仆人',
  companion: '同伴',
  predecessor: '前任者',
  successor: '继任者',
  reincarnation: '转世',
  host: '宿主',
  parasite: '寄生者',
  clone: '克隆体',
  original: '本体',
  contractor: '委托人',
  contracted: '受雇者',
  worshipper: '崇拜者',
  deity: '神祇',
  nemesis: '死敌',
  betrayer: '背叛者',
  betrayed: '被背叛者',
  rescuer: '拯救者',
  rescued: '被救者',
  soulmate: '灵魂伴侣',
  fused: '融合体',
  fragment: '碎片',
  mirror: '镜面体',
  shadow: '影子',
  past_self: '过去的自己',
  future_self: '未来的自己',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RELATION_COLORS: Record<string, string> = {
  // 基础关系 (21)
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
  // V3 新增关系 (30)
  protector: '#2E6B9E',    // deep blue - 保护
  protected: '#5BA3D9',    // light blue - 被保护
  twin: '#9932CC',         // dark violet - 双生
  spouse: '#E91E63',       // pink - 配偶
  ex_lover: '#B06290',     // mauve - 前恋
  adopted: '#FFB347',      // orange - 收养
  adoptive_parent: '#CD853F', // peru - 养父母
  master: '#4B0082',       // indigo - 主仆
  servant: '#708090',      // slate gray - 仆人
  companion: '#20B2AA',    // light sea green - 同伴
  predecessor: '#556B2F',  // olive drab - 前任
  successor: '#00CED1',    // dark turquoise - 继任
  reincarnation: '#9370DB', // medium purple - 转世
  host: '#8B4513',         // saddle brown - 宿主
  parasite: '#228B22',     // forest green - 寄生
  clone: '#483D8B',        // dark slate blue - 克隆
  original: '#FFD700',     // gold - 本体
  contractor: '#4682B4',   // steel blue - 委托
  contracted: '#696969',   // dim gray - 受雇
  worshipper: '#DA70D6',   // orchid - 崇拜
  deity: '#FFDAB9',       // peach puff - 神祇
  nemesis: '#8B0000',      // dark red - 死敌
  betrayer: '#DC143C',     // crimson - 背叛
  betrayed: '#800000',     // maroon - 被背叛
  rescuer: '#32CD32',      // lime green - 拯救
  rescued: '#98FB98',      // pale green - 被救
  soulmate: '#FF69B4',     // hot pink - 灵魂伴侣
  fused: '#7FFFD4',       // aquamarine - 融合
  fragment: '#DAA520',     // goldenrod - 碎片
  mirror: '#C0C0C0',       // silver - 镜面
  shadow: '#2F4F4F',       // dark slate gray - 影子
  past_self: '#BC8F8F',    // rosy brown - 过去自己
  future_self: '#ADD8E6',  // light blue - 未来自己
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
  'https://kog-lore-db.top';

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
