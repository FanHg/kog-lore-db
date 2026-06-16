'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/heroes', label: '英雄', icon: '⚔️' },
  { href: '/factions', label: '阵营', icon: '🏰' },
  { href: '/events', label: '事件', icon: '📜' },
  { href: '/timeline', label: '时间线', icon: '⏳' },
  { href: '/relations', label: '关系图', icon: '🕸️' },
  { href: '/locations', label: '地点', icon: '📍' },
  { href: '/organizations', label: '组织', icon: '🏛️' },
  { href: '/quotes', label: '名言', icon: '💬' },
  { href: '/video-topics', label: '视频话题', icon: '🎬' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark-800/95 backdrop-blur-sm border-b border-gold/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-6 flex-shrink-0">
            <span className="text-xl">👑</span>
            <div>
              <div className="text-sm font-bold text-gold leading-none">王者荣耀</div>
              <div className="text-xs text-parchment-dark leading-none">世界观数据库</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 overflow-x-auto">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'nav-link text-sm whitespace-nowrap px-2 py-1.5',
                  pathname.startsWith(item.href) && 'active'
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Search + API */}
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-600 border border-gold/20 rounded-md text-parchment-dark hover:text-gold hover:border-gold/40 transition-all text-sm"
            >
              🔍 <span className="hidden sm:inline">搜索</span>
            </Link>
            <a
              href="/api"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-azure/10 border border-azure/30 rounded-md text-azure-light hover:bg-azure/20 transition-all text-sm"
            >
              API
            </a>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-parchment-dark hover:text-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-3 border-t border-gold/10 pt-2">
            <div className="grid grid-cols-3 gap-1">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-2 rounded-md text-sm transition-colors',
                    pathname.startsWith(item.href)
                      ? 'bg-dark-600 text-gold'
                      : 'text-parchment-dark hover:text-gold hover:bg-dark-600'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
