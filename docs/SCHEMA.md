# 数据库 Schema 文档

## 概述

本项目使用 **JSON First Architecture**，所有数据存储为 JSON 文件，无需数据库服务器。

## 数据目录结构

```
data/
├── heroes/         # 每个英雄一个 JSON 文件，文件名即 ID
├── factions/       # 每个阵营一个 JSON 文件
├── events/         # 每个事件一个 JSON 文件
├── timeline/
│   └── index.json  # 时间线数组
├── relations/
│   └── index.json  # 关系数组
├── organizations/
│   └── index.json  # 组织数组
├── quotes/
│   └── index.json  # 名言数组
└── video-topics/
    └── index.json  # 视频话题数组
```

---

## Hero Schema（英雄）

```typescript
{
  id: string;            // 唯一 slug，如 "houyi"，必须与文件名一致
  name: string;          // 中文名，如 "后羿"
  title: string;         // 称号，如 "神射手"
  alias?: string[];      // 别名列表
  faction: string;       // 所属阵营 ID
  role: HeroRole[];      // ["战士"] | ["法师"] | ["射手"] | ["刺客"] | ["坦克"] | ["辅助"]
  difficulty: 1 | 2 | 3; // 难度：1简单 2中等 3困难
  description: string;   // 简介（建议 < 200 字）
  lore: string;          // 完整故事（Markdown 格式）
  relations: {
    targetId: string;    // 关联英雄 ID
    type: RelationType;  // 见下方关系类型
    description: string; // 关系描述
  }[];
  skills?: {
    name: string;
    type: "passive" | "active" | "ultimate";
    description: string;
  }[];
  tags: string[];        // 标签，用于搜索和分类
  imageUrl?: string;     // 图片路径，如 "/images/heroes/houyi.jpg"
  createdAt: string;     // ISO 8601 格式
  updatedAt: string;     // ISO 8601 格式
}
```

### 关系类型 (RelationType)

| 值 | 含义 |
|----|------|
| `ally` | 盟友 |
| `enemy` | 敌人 |
| `lover` | 恋人 |
| `mentor` | 师父 |
| `student` | 徒弟 |
| `sibling` | 兄弟姐妹 |
| `parent` | 父母 |
| `child` | 子女 |
| `rival` | 宿敌 |
| `neutral` | 中立 |

---

## Faction Schema（阵营）

```typescript
{
  id: string;
  name: string;
  type: "kingdom" | "organization" | "clan" | "race" | "religion" | "army";
  description: string;   // 简介
  content: string;       // 详细介绍（Markdown）
  leader?: string;       // 领袖英雄 ID
  members: string[];     // 成员英雄 ID 列表
  allies: string[];      // 同盟阵营 ID 列表
  enemies: string[];     // 敌对阵营 ID 列表
  location?: string;     // 主要地点 ID
  status: "active" | "destroyed" | "merged" | "dormant" | "unknown";
  tags: string[];
  imageUrl?: string;
}
```

---

## LoreEvent Schema（历史事件）

```typescript
{
  id: string;
  name: string;
  era: string;            // 所属纪元，如 "神话时代"
  date?: string;          // 大概时间描述，如 "约三千年前"
  description: string;    // 简介
  content: string;        // 详细经过（Markdown）
  participants: string[]; // 参与英雄 ID
  locations: string[];    // 相关地点 ID
  factions: string[];     // 相关阵营 ID
  type: "battle" | "political" | "divine" | "personal" | "founding" | "catastrophe";
  tags: string[];
  imageUrl?: string;
}
```

---

## Timeline Schema（时间线条目）

> 文件：`data/timeline/index.json`（数组格式）

```typescript
{
  id: string;
  era: string;        // 纪元名称
  name: string;       // 时期名称
  period: string;     // 时间段描述
  events: string[];   // 事件 ID 列表
  description: string;
  order: number;      // 排序：数字越小越早
  color?: string;     // 展示颜色（hex），如 "#D4A017"
}
```

---

## Relation Schema（关系）

> 文件：`data/relations/index.json`（数组格式）

```typescript
{
  id: string;           // 如 "rel-yao-houyi"
  sourceId: string;     // 源英雄 ID
  targetId: string;     // 目标英雄 ID
  type: RelationType;
  description: string;
  bidirectional: boolean; // 是否双向关系
  strength: number;       // 关系强度 0.0~1.0
  events?: string[];      // 相关事件 ID
}
```

---

## Location Schema（地点）

```typescript
{
  id: string;
  name: string;
  type: "city" | "region" | "realm" | "dungeon" | "battlefield" | "sacred" | "ruins" | "natural";
  description: string;
  content: string;         // Markdown
  faction?: string;        // 控制阵营 ID
  inhabitants: string[];   // 居民英雄 ID
  events: string[];        // 发生的事件 ID
  coordinates?: { x: number; y: number }; // 地图坐标（0-100 百分比）
  tags: string[];
  imageUrl?: string;
}
```

---

## Organization Schema（组织）

> 文件：`data/organizations/index.json`（数组格式）

```typescript
{
  id: string;
  name: string;
  type: "guild" | "order" | "cult" | "government" | "military" | "mercenary" | "secret";
  faction?: string;
  description: string;
  content: string;
  leader?: string;
  members: string[];
  purpose: string;
  status: "active" | "disbanded" | "secret" | "legendary";
  tags: string[];
}
```

---

## Quote Schema（名言）

> 文件：`data/quotes/index.json`（数组格式）

```typescript
{
  id: string;            // 如 "quote-houyi-001"
  heroId: string;
  text: string;          // 台词内容
  context?: string;      // 语境说明
  type: "battle" | "story" | "interaction" | "victory" | "defeat" | "select";
  tags: string[];
}
```

---

## VideoTopic Schema（视频话题）

> 文件：`data/video-topics/index.json`（数组格式）

```typescript
{
  id: string;
  title: string;
  description: string;
  heroIds: string[];
  factionIds: string[];
  eventIds: string[];
  type: "lore" | "analysis" | "comparison" | "timeline" | "speculation";
  keywords: string[];
  outline?: string;     // 视频大纲（Markdown）
  status: "idea" | "draft" | "published";
  tags: string[];
}
```

---

## 扩展到 1000+ 英雄

本架构为 JSON 文件系统，理论上无上限。实际建议：

1. **单文件限制**：每个英雄 JSON 文件保持在 50KB 以内
2. **索引文件**：`index.json` 只存储摘要，不含 `lore`/`content` 等长字段
3. **搜索优化**：英雄超过 500 个时，考虑迁移到 Algolia 或 MeiliSearch
4. **分页**：API 已内置分页支持，`pageSize` 默认 20
5. **图片**：使用 CDN（如 Cloudinary）存储图片，减少仓库体积
