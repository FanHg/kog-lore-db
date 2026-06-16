# 王者荣耀世界观数据库
## Honor of Kings Lore Database

> 完全公开的王者荣耀非官方世界观数据库  
> 支持 API 调用 · 可被 AI 读取 · SEO 优化

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/kog-lore-db)

---

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/kog-lore-db.git
cd kog-lore-db

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录并部署
vercel login
vercel --prod
```

---

## 📁 项目结构

```
kog-lore-db/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── heroes/             # 英雄页面
│   │   ├── factions/           # 阵营页面
│   │   ├── events/             # 事件页面
│   │   ├── timeline/           # 时间线
│   │   ├── relations/          # 关系图谱
│   │   ├── locations/          # 地点
│   │   ├── organizations/      # 组织
│   │   ├── quotes/             # 名言
│   │   ├── video-topics/       # 视频话题
│   │   ├── search/             # 全文搜索
│   │   ├── api/                # REST API 路由
│   │   ├── sitemap.ts          # 自动 Sitemap
│   │   ├── robots.ts           # robots.txt
│   │   └── llms.txt/           # AI 读取端点
│   ├── components/             # React 组件
│   └── lib/
│       ├── types.ts            # TypeScript 类型
│       ├── db.ts               # 数据库读取工具
│       ├── search.ts           # 全文搜索
│       └── utils.ts            # 工具函数
├── data/                       # JSON 数据库
│   ├── heroes/                 # 英雄数据
│   ├── factions/               # 阵营数据
│   ├── events/                 # 事件数据
│   ├── timeline/               # 时间线数据
│   ├── relations/              # 关系数据
│   ├── locations/              # 地点数据
│   ├── organizations/          # 组织数据
│   ├── quotes/                 # 名言数据
│   └── video-topics/           # 视频话题数据
├── scripts/
│   ├── init-db.js              # 初始化脚本
│   ├── generate-index.js       # 索引生成
│   └── validate-schema.js      # 数据验证
└── public/
    └── images/                 # 图片资源
```

---

## 📊 数据格式

### 添加新英雄

在 `data/heroes/` 目录创建 `{hero-id}.json`：

```json
{
  "id": "hero-id",
  "name": "英雄名",
  "title": "称号",
  "alias": ["别名1", "别名2"],
  "faction": "faction-id",
  "role": ["法师"],
  "difficulty": 2,
  "description": "简短介绍（不超过200字）",
  "lore": "## 完整故事\n\n支持 Markdown 格式...",
  "relations": [
    {
      "targetId": "other-hero-id",
      "type": "ally",
      "description": "关系描述"
    }
  ],
  "skills": [
    { "name": "技能名", "type": "active", "description": "技能描述" }
  ],
  "tags": ["标签1", "标签2"],
  "imageUrl": "/images/heroes/hero-id.jpg",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 关系类型

| type | 含义 |
|------|------|
| ally | 盟友 |
| enemy | 敌人 |
| lover | 恋人 |
| mentor | 师父 |
| student | 徒弟 |
| sibling | 兄弟姐妹 |
| parent | 父母 |
| child | 子女 |
| rival | 宿敌 |
| neutral | 中立 |

---

## 🔌 API 文档

所有 API 返回 JSON，完全公开，无需认证。

### 基础端点

```
GET /api                        # API 文档和统计
GET /api/heroes                 # 所有英雄列表
GET /api/heroes/:id             # 单个英雄详情
GET /api/factions               # 所有阵营
GET /api/factions/:id           # 单个阵营详情
GET /api/events                 # 所有历史事件
GET /api/events/:id             # 单个事件详情
GET /api/timeline               # 完整时间线
GET /api/relations              # 关系图谱数据
GET /api/locations              # 所有地点
GET /api/locations/:id          # 单个地点详情
GET /api/organizations          # 所有组织
GET /api/quotes                 # 所有名言
GET /api/video-topics           # 所有视频话题
GET /api/search?q=:query        # 全文搜索
```

### 搜索示例

```bash
curl "https://your-domain.com/api/search?q=后羿"
curl "https://your-domain.com/api/heroes?faction=changan"
curl "https://your-domain.com/api/heroes?role=射手"
```

---

## 🤖 AI 访问

本站专门优化了对 AI 系统的可读性：

- **`/llms.txt`** - AI 专用索引文件，列出所有内容
- **JSON-LD** - 每个页面包含结构化数据
- **Open API** - 无需认证的 REST API
- **robots.txt** - 明确允许 GPTBot、Claude、Gemini 等抓取

---

## 🛠️ 开发命令

```bash
npm run dev           # 启动开发服务器
npm run build         # 构建生产版本
npm run start         # 启动生产服务器
npm run generate:index # 重新生成数据索引
npm run validate      # 验证数据文件格式
npm run init:db       # 初始化目录结构
```

---

## 📦 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **搜索**: Fuse.js (模糊搜索)
- **内容**: Markdown (via marked)
- **数据库**: JSON 文件系统
- **部署**: Vercel
- **版本控制**: GitHub

---

## 🌟 功能特性

- ✅ 完全公开访问，无需登录
- ✅ SEO 优化，可被 Google 索引
- ✅ AI 友好，支持 ChatGPT/Claude/Gemini 读取
- ✅ REST API，支持第三方调用
- ✅ 全文搜索（Fuse.js）
- ✅ 英雄关系图谱（SVG 可视化）
- ✅ 历史时间线
- ✅ Markdown 内容支持
- ✅ 自动 sitemap.xml
- ✅ JSON-LD 结构化数据
- ✅ 响应式设计
- ✅ 支持扩展至 1000+ 英雄

---

## 🚢 GitHub 推送流程

```bash
# 初始化 Git
git init
git add .
git commit -m "feat: initial commit - KOG Lore Database"

# 连接 GitHub（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/kog-lore-db.git
git branch -M main
git push -u origin main
```

然后在 Vercel 导入此 GitHub 仓库即可自动部署。

---

## 📄 声明

本项目为非官方粉丝创作，仅供学习与交流使用。  
游戏内容版权归 TiMi Studio Group / 腾讯游戏所有。
