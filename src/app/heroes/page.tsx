import type { Metadata } from 'next';
import Link from 'next/link';
import { heroDb } from '@/lib/db';
import { ROLE_COLORS } from '@/lib/utils';

export const metadata: Metadata = {
  title: '英雄图鉴',
  description: '王者荣耀全英雄背景故事、阵营归属、技能介绍与人物关系。收录所有英雄的完整世界观资料。',
};

export const revalidate = 3600;

export default function HeroesPage() {
  const heroes = heroDb.getAll();
  const roles = ['全部', '战士', '法师', '射手', '刺客', '坦克', '辅助'];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">英雄图鉴</h1>
        <p className="text-parchment-dark">
          共收录 <span className="text-gold font-semibold">{heroes.length}</span> 位英雄的完整世界观资料
        </p>
      </div>

      {/* Role Filter (client interaction handled via URL params in production) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {roles.map(role => (
          <Link
            key={role}
            href={role === '全部' ? '/heroes' : `/heroes?role=${encodeURIComponent(role)}`}
            className="badge border border-gold/30 text-parchment-dark hover:border-gold hover:text-gold transition-all px-3 py-1 text-sm"
          >
            {role}
          </Link>
        ))}
      </div>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {heroes.map(hero => (
          <Link key={hero.id} href={`/heroes/${hero.id}`} className="card p-4 group">
            <div className="flex items-center gap-3 mb-2">
              {/* Small Avatar */}
              <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-dark-500 to-dark-600 rounded-full overflow-hidden border border-gold/20">
                {hero.avatarUrl ? (
                  <img src={hero.avatarUrl} alt={hero.name} className="w-full h-full object-cover" />
                ) : hero.imageUrl ? (
                  <img src={hero.imageUrl} alt={hero.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl leading-[48px] text-center block">⚔️</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-parchment group-hover:text-gold transition-colors truncate">
                  {hero.name}
                </h2>
              </div>
                <div className="text-xs text-gold-dark truncate">{hero.title}</div>
              </div>
            </div>
            <div className="text-xs text-gold-dark mb-1">{hero.title}</div>
            {hero.identity && (
              <div className="text-xs text-azure-light mb-1">{hero.identity}</div>
            )}

            <div className="flex flex-wrap gap-1 mb-2">
              {hero.role.map(r => (
                <span
                  key={r}
                  className="badge text-xs px-2 py-0.5 text-white"
                  style={{ backgroundColor: ROLE_COLORS[r] + '40', borderColor: ROLE_COLORS[r] + '60', border: '1px solid' }}
                >
                  {r}
                </span>
              ))}
              {hero.energy && (
                <span className="badge text-xs px-2 py-0.5 bg-dark-500 text-parchment-dark border border-gold/20">
                  {hero.energy}
                </span>
              )}
            </div>

            <p className="text-parchment-dark text-xs line-clamp-2">{hero.description}</p>
          </Link>
        ))}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: '王者荣耀英雄图鉴',
            description: '王者荣耀全英雄背景故事合集',
            numberOfItems: heroes.length,
            url: '/heroes',
          }),
        }}
      />
    </>
  );
}
