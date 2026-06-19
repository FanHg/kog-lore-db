// ============================================================
// 王者荣耀世界观数据库 - 完整类型定义 (V3)
// Honor of Kings Lore Database - Complete Type Definitions (V3)
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

// V3: 扩展至 40+ 种关系类型
export type RelationType =
  // 基础关系
  | 'ally' | 'enemy' | 'lover' | 'mentor' | 'student' | 'teacher'
  | 'sibling' | 'parent' | 'child' | 'rival' | 'neutral' | 'colleague'
  | 'teammate' | 'friend' | 'former_friend' | 'benefactor' | 'creator'
  | 'guardian' | 'comrade' | 'subordinate' | 'superior' | 'connection'
  // V3 新增关系
  | 'protector' | 'protected' | 'twin' | 'spouse' | 'ex_lover' | 'adopted'
  | 'adoptive_parent' | 'master' | 'servant' | 'companion' | 'predecessor'
  | 'successor' | 'reincarnation' | 'host' | 'parasite' | 'clone' | 'original'
  | 'contractor' | 'contracted' | 'worshipper' | 'deity' | 'nemesis'
  | 'betrayer' | 'betrayed' | 'rescuer' | 'rescued' | 'soulmate'
  | 'fused' | 'fragment' | 'mirror' | 'shadow' | 'past_self' | 'future_self';

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

// ---------- 区域详情 Area ----------
export interface SubArea {
  name: string;         // 小区域名称
  description?: string; // 小区域描述
  images?: string[];    // 小区域图片URL列表
}

export interface Area {
  name: string;         // 区域名称
  description: string;  // 区域详情描述
  images?: string[];    // 区域图片URL列表
  subAreas?: SubArea[]; // 小区域列表
}

// ---------- 城池/属地 District ----------
export interface District {
  name: string;              // 城池/属地名称
  description: string;       // 完整介绍
  images?: string[];         // 城池图片URL列表
  areas?: Area[];            // 子区域详情列表
  representHeroes?: string[]; // 代表英雄列表
  miracle?: string;          // 奇迹之力描述
}

// ---------- 阵营 Faction ----------
export interface Faction {
  id: string;
  name: string;
  type: FactionType;
  description: string;
  content?: string;          // 详细介绍
  districts?: District[];     // 城池/属地列表
  miracle?: string;           // 奇迹之力描述
  miracleImages?: string[];   // 奇迹之力图片URL列表
  leader?: string;            // 领袖英雄 ID
  members: string[];          // 成员英雄 ID（英雄名称列表）
  allies: string[];           // 同盟阵营 ID
  enemies: string[];          // 敌对阵营 ID
  location?: string;          // 主要地点 ID
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

// ============================================================
// V3 新增类型 - AI Native Knowledge Engine
// ============================================================

// ---------- 地域 Region ----------
export interface Region {
  id: string;              // e.g. "region_zhulu"
  name: string;            // 中文名称
  description: string;
  locations: string[];     // 地点 ID 列表
  factions: string[];      // 阵营 ID 列表
  geography: string;      // 地理特征
  climate: string;        // 气候描述
  significance: string;    // 战略/文化意义
  tags: string[];
}

// ----------  lore 物品 Item ----------
export interface LoreItem {
  id: string;
  name: string;
  type: 'weapon' | 'artifact' | 'relic' | 'tome' | 'potion' | 'material' | 'other';
  description: string;
  lore: string;             // 背景故事
  owner?: string;           // 当前持有者英雄 ID
  creator?: string;         // 创造者英雄 ID
  origin: string;          // 来源/出处
  abilities?: string[];      // 能力/效果列表
  tags: string[];
}

// ---------- 视频条目 Video Entry ----------
export interface VideoEntry {
  id: string;
  title: string;
  platform: 'douyin' | 'kuaishou' | 'bilibili' | 'video_channel' | 'xiaohongshu';
  url?: string;
  duration: number;         // 秒
  heroes: string[];         // 相关英雄 ID
  tags: string[];
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  metrics?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
}

// ---------- 英雄技能 Hero Skill ----------
export interface HeroSkill {
  id: string;
  heroId: string;
  name: string;
  type: 'passive' | 'active' | 'ultimate';
  description: string;
  lore: string;             // 技能背景故事/设定
  effects: string[];
  cooldown?: number;        // 冷却时间（秒）
  manaCost?: number;        // 蓝耗
  tags: string[];
}

// ---------- 对话 Dialogue ----------
export type DialogueType = 'story' | 'battle' | 'interaction' | 'quest' | 'cutscene' | 'lore' | 'emote';

export type EmotionType = 'neutral' | 'happy' | 'sad' | 'angry' | 'fear' | 'surprise' | 'disgust' | 'love' | 'determination' | 'confused' | 'calm' | 'excited' | 'mysterious';

export interface Dialogue {
  id: string;
  heroId: string;
  text: string;
  context: string;          // 发生场景
  type: DialogueType;
  emotion: EmotionType;
  targetId?: string;        // 对话对象英雄 ID
  eventId?: string;         // 关联事件 ID
  tags: string[];
  source: string;           // 出处（游戏/漫画/动画/官方文本）
}

// ---------- 故事节点 Story Node ----------
export interface StoryNode {
  id: string;
  title: string;
  eventId?: string;         // 关联事件 ID
  characters: string[];      // 参与英雄 ID
  action: string;            // 核心行为/动作
  cause: string;             // 原因/动机
  impact: string;            // 直接影响
  result: string;            // 结果/后果
  nextEvents: string[];      // 后续事件 ID
  prevEvents: string[];      // 前置事件 ID
  tags: string[];
  location?: string;         // 发生地点 ID
  timelinePosition: number;  // 时间线位置（数值越小越早）
}

// ---------- 记忆 Memory ----------
export interface Memory {
  id: string;
  type: 'fact' | 'rule' | 'preference' | 'correction' | 'insight' | 'relationship' | 'decision';
  content: string;
  source: string;             // 来源：哪个文件/数据
  confidence: number;         // 0.0 ~ 1.0
  heroIds?: string[];         // 相关英雄
  eventIds?: string[];        // 相关事件
  projectId?: string;         // 所属项目
  createdAt: string;
  updatedAt: string;
  tags: string[];
  accessCount: number;        // 被引用次数
  lastAccessed?: string;
}

// ---------- 对话记录 Conversation Entry ----------
export interface ConversationEntry {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  projectId?: string;
  taskId?: string;
  timestamp: string;
  tags: string[];
  referencedEntities: string[]; // 引用的实体 ID
}

// ---------- 决策 Decision ----------
export interface Decision {
  id: string;
  context: string;            // 决策背景
  options: string[];          // 可选方案
  chosen: string;             // 最终选择
  reason: string;             // 选择理由
  projectId?: string;
  taskId?: string;
  impact: string;             // 预期影响
  status: 'pending' | 'made' | 'reversed' | 'superseded';
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// ---------- Prompt 记录 Prompt Entry ----------
export interface PromptEntry {
  id: string;
  title: string;
  prompt: string;             // 完整 Prompt 文本
  type: 'system' | 'user' | 'template' | 'script' | 'search' | 'generation';
  projectId?: string;
  taskId?: string;
  output?: string;             // 输出结果摘要
  model?: string;              // 使用的模型
  tokens?: number;             // 消耗 token 数
  createdAt: string;
  tags: string[];
}

// ---------- 项目 Project ----------
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  type: 'short_drama' | 'analysis' | 'database' | 'tool' | 'research' | 'content';
  seasons: Season[];
  heroes: string[];           // 相关英雄
  factions: string[];         // 相关阵营
  decisions: string[];        // 决策 ID 列表
  memories: string[];         // 记忆 ID 列表
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Season {
  id: string;
  name: string;
  description: string;
  episodes: Episode[];
  order: number;
  status: 'draft' | 'in_production' | 'completed' | 'published';
}

export interface Episode {
  id: string;
  name: string;
  description: string;
  scriptUrl?: string;
  storyNodeIds: string[];
  duration: number;           // 预计时长（秒）
  platform: string[];         // 目标平台
  status: 'draft' | 'scripted' | 'produced' | 'published';
  order: number;
}

// ---------- 任务 Task ----------
export interface Task {
  id: string;
  name: string;
  description: string;
  projectId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;        // 分配给（AI agent / human）
  dependencies: string[];      // 依赖任务 ID
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  result?: string;            // 完成结果
  tags: string[];
}

// ---------- 脚本生成 ----------
export interface ScriptRequest {
  heroId: string;             // 主角英雄
  platform: 'douyin' | 'kuaishou' | 'bilibili' | 'video_channel' | 'xiaohongshu';
  style: 'epic' | 'emotional' | 'comedic' | 'mysterious' | 'action' | 'lore';
  duration: number;            // 目标时长（秒），通常 60-180
  focusEvents?: string[];      // 重点事件 ID
  focusRelations?: string[];   // 重点关系 ID
  toneNotes?: string;          // 语气备注
  bgmPreference?: string;      // BGM偏好
}

export interface ScriptOutput {
  id: string;
  request: ScriptRequest;
  title: string;
  hook: string;                // 开头钩子（黄金3秒）
  scenes: ScriptScene[];
  totalDuration: number;
  suggestedBgm: string;
  suggestedTags: string[];
  suggestedTitle: string[];
  platform: string;
  createdAt: string;
}

export interface ScriptScene {
  id: string;
  order: number;
  title: string;
  duration: number;            // 本幕时长（秒）
  type: 'opening' | 'rising' | 'climax' | 'falling' | 'ending';
  content: string;             // 脚本内容（包含镜头、旁白、字幕、动作）
  characters: string[];         // 出现角色
  location?: string;
  bgm?: string;
  sfx?: string[];              // 音效
  subtitle: string;            // 字幕文案
  voiceover?: string;          // 旁白文案
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
  type: 'hero' | 'faction' | 'event' | 'location' | 'organization' | 'quote' | 'videoTopic' | 'storyNode' | 'project' | 'task' | 'dialogue';
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
  type: 'hero' | 'faction' | 'location' | 'event' | 'item';
  group?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: RelationType;
  strength?: number;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
