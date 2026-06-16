# API 完整文档

## 基础信息

- **Base URL**: `https://your-domain.vercel.app/api`
- **Content-Type**: `application/json`
- **认证**: 无需认证，完全公开
- **CORS**: 已开启，允许所有来源
- **缓存**: 响应缓存 1 小时（搜索接口除外）

## 通用响应格式

```json
{
  "data": "...",        // 响应数据
  "total": 100,         // 总数（列表接口）
  "page": 1,            // 当前页（分页接口）
  "pageSize": 20,       // 每页数量（分页接口）
  "timestamp": "..."    // 响应时间
}
```

## 错误格式

```json
{
  "error": "Not found",
  "code": 404,
  "timestamp": "..."
}
```

---

## 英雄 API

### 获取英雄列表

```
GET /api/heroes
```

**查询参数**:
- `faction` - 按阵营过滤 (e.g., `changan`)
- `role` - 按职位过滤 (e.g., `射手`)
- `page` - 页码，默认 1
- `pageSize` - 每页数量，默认 20，最大 100

**示例**:
```bash
GET /api/heroes
GET /api/heroes?faction=changan
GET /api/heroes?role=射手&page=1&pageSize=10
```

**响应**:
```json
{
  "data": [
    {
      "id": "houyi",
      "name": "后羿",
      "title": "神射手",
      "faction": "changan",
      "role": ["射手"],
      "difficulty": 1,
      "description": "...",
      "relations": [...],
      "tags": [...]
    }
  ],
  "total": 4,
  "page": 1,
  "pageSize": 20
}
```

> 注：列表接口省略了 `lore` 字段以减少响应大小

### 获取英雄详情

```
GET /api/heroes/:id
```

**示例**: `GET /api/heroes/houyi`

**响应** (包含完整数据):
```json
{
  "data": {
    "id": "houyi",
    "name": "后羿",
    "title": "神射手",
    "lore": "## 完整故事...",
    "skills": [...],
    "quotes": [...],
    "relatedEvents": [...],
    "enrichedRelations": [...]
  }
}
```

---

## 阵营 API

### 获取阵营列表

```
GET /api/factions
```

### 获取阵营详情

```
GET /api/factions/:id
```

**示例**: `GET /api/factions/changan`

---

## 事件 API

### 获取事件列表

```
GET /api/events
```

**查询参数**:
- `era` - 按纪元过滤
- `type` - 按类型过滤 (`battle`, `divine`, `political`, `personal`, `founding`, `catastrophe`)

### 获取事件详情

```
GET /api/events/:id
```

---

## 时间线 API

```
GET /api/timeline
```

返回完整时间线，按时间顺序排列，包含每个时期的详细事件。

---

## 关系图谱 API

```
GET /api/relations
```

返回图谱数据格式：
```json
{
  "data": {
    "nodes": [
      { "id": "houyi", "name": "后羿", "type": "hero", "group": "changan" }
    ],
    "edges": [
      { "source": "houyi", "target": "yao", "type": "lover", "label": "...", "strength": 0.95 }
    ]
  }
}
```

---

## 搜索 API

```
GET /api/search?q=:query
```

**查询参数**:
- `q` - 搜索关键词（必填）
- `limit` - 结果数量上限，默认 20，最大 50
- `type` - 过滤类型 (`hero`, `faction`, `event`, `location`)

**示例**:
```bash
GET /api/search?q=后羿
GET /api/search?q=长安&type=faction
GET /api/search?q=射日&limit=5
```

**响应**:
```json
{
  "data": [
    {
      "type": "hero",
      "id": "houyi",
      "name": "后羿",
      "description": "...",
      "url": "/heroes/houyi",
      "tags": ["射日英雄"],
      "score": 0.05
    }
  ],
  "total": 1
}
```

---

## AI 集成示例

### 在 ChatGPT / Claude 中使用

```
请访问 https://your-domain.com/api/heroes/houyi 获取后羿的详细世界观资料
```

### Python 调用示例

```python
import requests

# 获取所有英雄
heroes = requests.get('https://your-domain.com/api/heroes').json()

# 搜索
results = requests.get('https://your-domain.com/api/search', params={'q': '后羿'}).json()

# 获取英雄详情
houyi = requests.get('https://your-domain.com/api/heroes/houyi').json()
print(houyi['data']['lore'])
```

### JavaScript 调用示例

```javascript
// 搜索英雄
const response = await fetch('/api/search?q=长安');
const { data } = await response.json();

// 获取关系图谱
const graph = await fetch('/api/relations').then(r => r.json());
```
