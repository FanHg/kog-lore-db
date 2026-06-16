'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SearchResult } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  hero: '英雄', faction: '阵营', event: '事件',
  location: '地点', organization: '组织', quote: '名言', videoTopic: '视频话题',
};

const TYPE_ICONS: Record<string, string> = {
  hero: '⚔️', faction: '🏰', event: '📜',
  location: '📍', organization: '🏛️', quote: '💬', videoTopic: '🎬',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=30`);
      const json = await res.json();
      setResults(json.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">全文搜索</h1>
        <p className="text-parchment-dark">搜索英雄、阵营、事件、地点等所有世界观内容</p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            placeholder="输入英雄名、阵营名、关键词…"
            className="flex-1 bg-dark-700 border border-gold/30 rounded-lg px-4 py-3 text-parchment placeholder-parchment-dark/50 focus:outline-none focus:border-gold transition-colors"
          />
          <button
            onClick={() => handleSearch(query)}
            disabled={loading}
            className="btn-primary px-6 py-3 disabled:opacity-50"
          >
            {loading ? '搜索中…' : '搜索'}
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="text-center text-parchment-dark py-8">搜索中…</div>
          ) : results.length === 0 ? (
            <div className="text-center text-parchment-dark py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p>未找到「{query}」相关内容</p>
              <p className="text-sm mt-2">尝试其他关键词，如英雄名、阵营名、事件名等</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-parchment-dark mb-4">
                找到 <span className="text-gold">{results.length}</span> 条结果
              </div>
              <div className="space-y-3">
                {results.map(result => (
                  <Link key={`${result.type}-${result.id}`} href={result.url} className="card p-4 group block">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{TYPE_ICONS[result.type]}</span>
                      <span className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/20">
                        {TYPE_LABELS[result.type]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-parchment group-hover:text-gold transition-colors">
                      {result.name}
                    </h3>
                    <p className="text-parchment-dark text-sm mt-1 line-clamp-2">{result.description}</p>
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="badge bg-dark-600 text-parchment-dark text-xs border border-gold/10">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!searched && (
        <div className="text-center text-parchment-dark py-12">
          <div className="text-6xl mb-4">🔮</div>
          <p className="text-lg mb-2">输入关键词开始搜索</p>
          <p className="text-sm">支持英雄名、阵营名、地点、事件、台词等全文搜索</p>
        </div>
      )}
    </>
  );
}
