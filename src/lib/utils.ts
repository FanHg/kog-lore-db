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
  sibling: '兄弟姐妹',
  parent: '父母',
  child: '子女',
  rival: '宿敌',
  neutral: '中立',
};

export const RELATION_COLORS: Record<RelationType, string> = {
  ally: '#1A8A5A',    // jade - 友善
  enemy: '#C02030',   // crimson - 敌对
  lover: '#D44077',   // rose - 恋情
  mentor: '#D4A017',  // gold - 传承
  student: '#A07810', // dark gold - 学习
  sibling: '#2A7AAA', // azure - 家庭
  parent: '#1A5A8A',  // dark azure - 亲情
  child: '#3A8ABB',   // light azure - 亲情
  rival: '#A03080',   // purple - 对立
  neutral: '#6A7080', // gray - 中立
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
