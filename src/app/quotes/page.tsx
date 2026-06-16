import type { Metadata } from 'next';
import Link from 'next/link';
import { quoteDb, heroDb } from '@/lib/db';

export const metadata: Metadata = {
  title: '经典名言',
  description: '王者荣耀英雄们留下的经典台词与名言，来自战场、故事与人物互动的精华话语。',
};

export const revalidate = 3600;

export default function QuotesPage() {
  const quotes = quoteDb.getAll();

  const quotesByHero = quotes.reduce<Record<string, typeof quotes>>(
    (acc, q) => {
      if (!acc[q.heroId]) acc[q.heroId] = [];
      acc[q.heroId].push(q);
      return acc;
    },
    {}
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">经典名言</h1>
        <p className="text-parchment-dark">
          共收录 <span className="text-gold font-semibold">{quotes.length}</span> 条经典台词
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(quotesByHero).map(([heroId, heroQuotes]) => {
          const hero = heroDb.getById(heroId);
          return (
            <div key={heroId}>
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/heroes/${heroId}`} className="text-xl font-bold text-gold hover:text-gold-light transition-colors">
                  {hero?.name || heroId}
                </Link>
                <span className="text-parchment-dark text-sm">{hero?.title}</span>
              </div>
              <div className="space-y-3 pl-4 border-l-2 border-gold/20">
                {heroQuotes.map(quote => (
                  <blockquote key={quote.id} className="py-2">
                    <p className="text-parchment text-base italic">「{quote.text}」</p>
                    {quote.context && (
                      <p className="text-parchment-dark text-xs mt-1 ml-2">—— {quote.context}</p>
                    )}
                    <div className="flex gap-1 mt-2">
                      <span className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">
                        {quote.type}
                      </span>
                      {quote.tags.map(tag => (
                        <span key={tag} className="badge bg-dark-600 text-parchment-dark text-xs border border-gold/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </blockquote>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
