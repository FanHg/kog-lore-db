// ============================================================
// 王者荣耀世界观数据库 - 完整类型定义
// Honor of Kings Lore Database - Complete Type Definitions
// ============================================================

// ---------- 英雄 Hero ----------
export interface Hero {
  id: string;            // 唯一标识符 (slug), e.g. "yao"
  name: string;          // 中文名称, e.g. "瑶"
  title: string;         // 称号, e.g. "圣光女神"
  alias?: string[];      // 别名列表
  faction: string;       // 所属阵营 ID
  factionName?: string;  // 阵营中文名, e.g. "稷下学院"
  role: HeroRole[];      // 游戏定位
  difficulty: 1 | 2 | 3; // 操作难度
  energy?: string;       // 能量类型, e.g. "魔道"/"机关"
  region?: string;       // 所属地域, e.g. "逐鹿"
  race?: string;         // 种族, e.g. "人类"/"人造人"
  city?: string;         // 所在城市, e.g. "稷下学院"
  height?: string;       // 身高, e.g. "175cm"
  identity?: string;     // 身份标签, e.g. "稷下三贤者"
  description: string;   // 简短介绍 (< 200字)
  lore: string;          // 完整故事 (Markdown)
  relations: HeroRelation[];
  skills?: Skill[];
  voiceLines?: VoiceLines; // 语音台词
  tags: string[];
  imageUrl?: string;
  avatarUrl?: string;    // 头像图片路径
  createdAt: string;     // ISO 8601
  updatedAt: string;
}

export interface VoiceLines {
  move?: string;         // 移动语音
  skill?: string;        // 技能语音
  interaction?: string;  // 互动语音
  function?: string;     // 功能语音
}

export type HeroRole = '战士' | '法师' | '射手' | '刺客' | '坦克' | '辅助';

export interface HeroRelation {
  targetId: string;
  type: RelationType;
  description: string;
}

export type RelationType =
  | 'ally'          // 盟友
  | 'enemy'         // 敌人
  | 'lover'         // 恋人
  | 'mentor'        // 师父
  | 'student'       // 徒弟
  | 'teacher'       // 老师（与 mentor 类似，更口语化）
  | 'sibling'       // 兄弟姐妹
  | 'parent'        // 父母
  | 'child'         // 子女
  | 'rival'         // 宿敌
  | 'neutral'       // 中立
  | 'colleague'     // 同僚
  | 'teammate'      // 队友
  | 'friend'        // 朋友
  | 'former_friend' // 昔日好友
  | 'benefactor'    // 恩人
  | 'creator'       // 创造者
  | 'guardian'      // 守护者
  | 'comrade'       // 战友
  | 'subordinate'   // 下属
  | 'superior'      // 上级
  | 'connection';   // 关联

export interface Skill {
  name: string;
  type: 'passive' | 'active' | 'ultimate';
  description: string;
}

// ---------- 关系 Relation ----------
export interface Relation {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  description: string;
  bidirectional: boolean;
  strength: number;    // 0.0 ~ 1.0, 关系强度
  events?: string[];   // 相关事件 ID
}

// ---------- 事件 Lore Event ----------
export interface LoreEvent {
  id: string;
  name: string;
  era: string;           // 所属纪元
  date?: string;         // 大概时间
  description: string;   // 简介
  content: string;       // 完整内容 (Markdown)
  participants: string[]; // 参与英雄 ID
  locations: string[];   // 相关地点 ID
  factions: string[];    // 相关阵营 ID
  type: EventType;
  tags: string[];
  imageUrl?: string;
}

export type EventType =
  | 'battle'       // 战役
  | 'political'    // 政治事件
  | 'divine'       // 神祇降临/神圣事件
  | 'personal'     // 个人故事
  | 'founding'     // 建国/建立
  | 'catastrophe'; // 灾难

// ---------- 时间线 Timeline ----------
export interface TimelineEntry {
  id: string;
  era: string;       // 纪元名称
  name: string;      // 时期名称
  period: string;    // 时间段描述
  events: string[];  // 事件 ID 列表
  description: string;
  order: number;     // 排序序号 (数字越小越早)
  color?: string;    // 纪元颜色 (hex)
}

// ---------- 城池/属地 District ----------
export interface District {
  name: string;         // 城池/属地名称
  description: string;  // 简介
}

// ---------- 阵营 Faction ----------
export interface Faction {
  id: string;
  name: string;
  type: FactionType;
  description: string;
  content: string;       // 完整介绍 (Markdown)
  districts?: District[]; // 城池/属地列表
  miracle?: string;      // 奇迹之力描述
  leader?: string;       // 领袖英雄 ID
  members: string[];     // 成员英雄 ID（英雄名称列表）
  allies: string[];      // 同盟阵营 ID
  enemies: string[];     // 敌对阵营 ID
  location?: string;     // 主要地点 ID
  status: FactionStatus;
  tags: string[];
  imageUrl?: string;
}

export type FactionType =
  | 'kingdom'      // 王国
  | 'organization' // 组织
  | 'clan'         // 氏族
  | 'race'         // 种族
  | 'religion'     // 宗教
  | 'army'         // 军队
  | 'region';      // 地区/阵营

export type FactionStatus = 'active' | 'destroyed' | 'merged' | 'dormant' | 'unknown';

// ---------- 地点 Location ----------
export interface Location {
  id: string;
  name: string;
  type: LocationType;
  description: string;
  content: string;         // Markdown
  faction?: string;        // 控制阵营 ID
  inhabitants: string[];   // 居民英雄 ID
  events: string[];        // 发生的事件 ID
  coordinates?: { x: number; y: number }; // 用于地图可视化
  tags: string[];
  imageUrl?: string;
}

export type LocationType =
  | 'city'        // 城市
  | 'region'      // 地区
  | 'realm'       // 界域
  | 'dungeon'     // 地下城
  | 'battlefield' // 战场
  | 'sacred'      // 圣地
  | 'ruins'       // 遗迹
  | 'natural';    // 自然地貌

// ---------- 组织 Organization ----------
export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  faction?: string;
  description: string;
  content: string;
  leader?: string;
  members: string[];
  purpose: string;
  status: 'active' | 'disbanded' | 'secret' | 'legendary';
  tags: string[];
}

export type OrganizationType =
  | 'guild'      // 公会
  | 'order'      // 骑士团/修会
  | 'cult'       // 邪教
  | 'government' // 政府机构
  | 'military'   // 军队
  | 'mercenary'  // 雇佣军
  | 'secret';    // 秘密组织

// ---------- 名言 Quote ----------
export interface Quote {
  id: string;
  heroId: string;
  text: string;
  context?: string;
  type: 'battle' | 'story' | 'interaction' | 'victory' | 'defeat' | 'select';
  tags: string[];
}

// ---------- 视频话题 Video Topic ----------
export interface VideoTopic {
  id: string;
  title: string;
  description: string;
  heroIds: string[];
  factionIds: string[];
  eventIds: string[];
  type: 'lore' | 'analysis' | 'comparison' | 'timeline' | 'speculation';
  keywords: string[];
  outline?: string;      // Markdown 大纲
  status: 'idea' | 'draft' | 'published';
  tags: string[];
}

// ---------- API 通用响应 ----------
export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
  timestamp: string;
}

export interface ApiError {
  error: string;
  code: number;
  timestamp: string;
}

export interface SearchResult {
  type: 'hero' | 'faction' | 'event' | 'location' | 'organization' | 'quote' | 'videoTopic';
  id: string;
  name: string;
  description: string;
  url: string;
  tags?: string[];
  score?: number;
}

// ---------- 图谱节点 Graph Node ----------
export interface GraphNode {
  id: string;
  name: string;
  type: 'hero' | 'faction';
  group?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: RelationType;
  label: string;
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
