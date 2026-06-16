import Link from 'next/link';
import { getStats } from '@/lib/db';
import { heroDb, factionDb, eventDb } from '@/lib/db';
import { SITE_CONFIG } from '@/lib/utils';

export const revalidate = 3600;

const NAV_SECTIONS = [
  { href: '/heroes', label: '英雄图鉴', icon: '⚔️', desc: '全英雄背景故事与技能介绍' },
  { href: '/factions', label: '阵营势力', icon: '🏰', desc: '各大阵营历史与成员关系' },
  { href: '/events', label: '历史事件', icon: '📜', desc: '改变世界格局的重要事件' },
  { href: '/timeline', label: '时间线', icon: '⏳', desc: '王者大陆纪年与历史演进' },
  { href: '/relations', label: '关系图谱', icon: '🕸️', desc: '英雄之间的复杂关系网络' },
  { href: '/locations', label: '地点地图', icon: '🗺️', desc: '王者大陆各大重要地点' },
  { href: '/quotes', label: '经典名言', icon: '💬', desc: '英雄们留下的传世名句' },
  { href: '/video-topics', label: '视频话题', icon: '🎬', desc: '世界观解析视频选题库' },
];

export default async function HomePage() {
  const stats = getStats();
  const recentHeroes = heroDb.getAll().slice(0, 3);
  const recentEvents = eventDb.getAll().slice(0, 2);

  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-16 mb-12 relative">
        <div className="absolute inset-0 bg-gradient-radial from-gold/5 to-transparent rounded-3xl" />
        <div className="relative">
          <div className="text-gold text-sm font-mono mb-3 tracking-widest uppercase opacity-70">
            Honor of Kings · Lore Database
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-parchment mb-4">
            王者荣耀
            <span className="block text-gold mt-1">世界观数据库</span>
          </h1>
          <p className="text-parchment-dark text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            收录全英雄背景故事、阵营关系、历史事件与世界地理。
            完全公开访问，支持API调用，可被AI阅读索引。
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/heroes" className="btn-primary text-base px-6 py-3">
              探索英雄图鉴 →
            </Link>
            <Link href="/search" className="btn-ghost text-base px-6 py-3">
              全文搜索
            </Link>
            <a
              href="/api"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-base px-6 py-3"
            >
              API 文档
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: '英雄', count: stats.heroes, icon: '⚔️', href: '/heroes' },
          { label: '阵营', count: stats.factions, icon: '🏰', href: '/factions' },
          { label: '事件', count: stats.events, icon: '📜', href: '/events' },
          { label: '名言', count: stats.quotes, icon: '💬', href: '/quotes' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card p-5 text-center group"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-gold group-hover:text-gold-light transition-colors">
              {stat.count}
            </div>
            <div className="text-sm text-parchment-dark">{stat.label}</div>
          </Link>
        ))}
      </section>

      {/* Navigation Grid */}
      <section className="mb-12">
        <h2 className="section-title">内容分类</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NAV_SECTIONS.map(section => (
            <Link key={section.href} href={section.href} className="card p-5 group">
              <div className="text-2xl mb-2">{section.icon}</div>
              <h3 className="font-semibold text-gold group-hover:text-gold-light transition-colors mb-1">
                {section.label}
              </h3>
              <p className="text-sm text-parchment-dark">{section.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Heroes */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">最新英雄</h2>
          <Link href="/heroes" className="text-gold hover:text-gold-light text-sm transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentHeroes.map(hero => (
            <Link key={hero.id} href={`/heroes/${hero.id}`} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-parchment group-hover:text-gold transition-colors">
                    {hero.name}
                  </h3>
                  <div className="text-sm text-gold-dark">{hero.title}</div>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {hero.role.map(r => (
                    <span key={r} className="badge bg-dark-500 text-parchment-dark border border-gold/20">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-parchment-dark text-sm line-clamp-2">{hero.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Events */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">重要事件</h2>
          <Link href="/events" className="text-gold hover:text-gold-light text-sm transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentEvents.map(event => (
            <Link key={event.id} href={`/events/${event.id}`} className="card p-5 group">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-crimson/20 text-crimson border border-crimson/30">
                  {event.era}
                </span>
                <span className="text-parchment-dark text-xs">{event.date}</span>
              </div>
              <h3 className="font-bold text-parchment group-hover:text-gold transition-colors mb-1">
                {event.name}
              </h3>
              <p className="text-parchment-dark text-sm line-clamp-2">{event.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* API Info */}
      <section className="card p-6 mb-8 border-azure/30">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🤖</div>
          <div>
            <h3 className="text-lg font-semibold text-azure-light mb-2">AI 友好 · 开放 API</h3>
            <p className="text-parchment-dark text-sm mb-3">
              本站所有数据均可通过 REST API 访问，支持 ChatGPT、Claude、Gemini 等 AI 系统读取。
              所有页面均包含结构化 JSON-LD 数据，便于 AI 理解内容语义。
            </p>
            <div className="flex flex-wrap gap-2">
              <code className="text-xs bg-dark-500 text-gold px-2 py-1 rounded">GET /api/heroes</code>
              <code className="text-xs bg-dark-500 text-gold px-2 py-1 rounded">GET /api/heroes/:id</code>
              <code className="text-xs bg-dark-500 text-gold px-2 py-1 rounded">GET /api/search?q=</code>
              <a href="/api" className="text-xs text-azure-light underline">查看完整文档 →</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
