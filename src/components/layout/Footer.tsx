import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-gold/10 mt-16">
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">👑</span>
              <span className="text-gold font-bold">王者荣耀世界观数据库</span>
            </div>
            <p className="text-parchment-dark text-sm leading-relaxed">
              完全公开的非官方世界观数据库，收录英雄故事、阵营关系、历史事件，支持AI读取与API调用。
            </p>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-parchment font-semibold mb-3 text-sm uppercase tracking-wider">内容分类</h3>
            <ul className="space-y-1.5">
              {[
                { href: '/heroes', label: '英雄图鉴' },
                { href: '/factions', label: '阵营势力' },
                { href: '/events', label: '历史事件' },
                { href: '/timeline', label: '时间线' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-parchment-dark hover:text-gold transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-parchment font-semibold mb-3 text-sm uppercase tracking-wider">更多</h3>
            <ul className="space-y-1.5">
              {[
                { href: '/relations', label: '关系图谱' },
                { href: '/locations', label: '地点地图' },
                { href: '/quotes', label: '经典名言' },
                { href: '/video-topics', label: '视频话题' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-parchment-dark hover:text-gold transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* API */}
          <div>
            <h3 className="text-parchment font-semibold mb-3 text-sm uppercase tracking-wider">开放API</h3>
            <ul className="space-y-1.5">
              {[
                { href: '/api', label: 'API 文档' },
                { href: '/api/heroes', label: 'Heroes API' },
                { href: '/api/search?q=后羿', label: 'Search API' },
                { href: '/llms.txt', label: 'llms.txt (AI)' },
                { href: '/sitemap.xml', label: 'Sitemap' },
              ].map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-parchment-dark hover:text-azure-light transition-colors text-sm font-mono"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-parchment-dark text-xs">
            © {new Date().getFullYear()} {SITE_CONFIG.name}。本站为非官方粉丝项目，仅供学习交流使用。
          </p>
          <div className="flex items-center gap-4 text-xs text-parchment-dark">
            <span>完全公开访问</span>
            <span>·</span>
            <span>AI 友好</span>
            <span>·</span>
            <span>REST API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
