import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { factionDb, heroDb, locationDb } from '@/lib/db';
import { marked } from 'marked';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return factionDb.getAllIds().map(id => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const faction = factionDb.getById(params.slug);
  if (!faction) return {};
  return {
    title: `${faction.name} - 王者荣耀世界观数据库`,
    description: faction.description,
  };
}

export default function FactionPage({ params }: Props) {
  const faction = factionDb.getById(params.slug);
  if (!faction) notFound();

  // members 存的是英雄名称，尝试按名称查找
  const memberHeroes = faction.members
    .map(nameOrId => heroDb.getById(nameOrId))
    .filter(Boolean);

  const allies = faction.allies.map(id => factionDb.getById(id)).filter(Boolean);
  const enemies = faction.enemies.map(id => factionDb.getById(id)).filter(Boolean);
  const location = faction.location ? locationDb.getById(faction.location) : null;
  const contentHtml = faction.content
    ? (marked(faction.content, { breaks: true, gfm: true }) as string)
    : '';

  return (
    <>
      <nav className="flex items-center gap-2 text-sm text-parchment-dark mb-6">
        <Link href="/" className="hover:text-gold transition-colors">首页</Link>
        <span>/</span>
        <Link href="/factions" className="hover:text-gold transition-colors">阵营势力</Link>
        <span>/</span>
        <span className="text-parchment">{faction.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧信息栏 */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="card p-5">
            <h1 className="text-2xl font-bold text-parchment mb-1">{faction.name}</h1>
            <div className="flex gap-2 mb-4">
              <span className="badge bg-dark-500 text-parchment-dark border border-gold/20 text-xs">
                地区阵营
              </span>
              <span className="badge text-xs border bg-jade/20 text-jade border-jade/30">
                活跃
              </span>
            </div>

            {location && (
              <div className="mb-3 text-sm">
                <span className="text-parchment-dark">主要地点：</span>
                <Link href={`/locations/${location.id}`} className="text-gold hover:text-gold-light transition-colors">
                  {location.name}
                </Link>
              </div>
            )}

            {/* 城池/属地数量 */}
            {faction.districts && faction.districts.length > 0 && (
              <div className="mb-3 text-sm">
                <span className="text-parchment-dark">城池/属地：</span>
                <span className="text-gold">{faction.districts.length} 处</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1 mt-3">
              {faction.tags.map(tag => (
                <span key={tag} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 城池/属地快速导航 */}
          {faction.districts && faction.districts.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">城池 / 属地</h3>
              <div className="space-y-2">
                {faction.districts.map(district => (
                  <a key={district.name} href={`#district-${encodeURIComponent(district.name)}`}
                    className="flex items-center gap-2 p-2 rounded hover:bg-dark-600 transition-colors group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold transition-colors" />
                    <div>
                      <div className="text-sm font-medium text-parchment group-hover:text-gold transition-colors">{district.name}</div>
                      {district.areas && district.areas.length > 0 && (
                        <div className="text-xs text-parchment-dark">{district.areas.length} 个区域</div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 代表英雄 */}
          {memberHeroes.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">代表英雄 ({memberHeroes.length})</h3>
              <div className="space-y-2">
                {memberHeroes.map(hero => (
                  <Link key={hero!.id} href={`/heroes/${hero!.id}`}
                    className="flex items-center gap-2 p-2 rounded hover:bg-dark-600 transition-colors">
                    {hero!.avatarUrl && (
                      <img src={hero!.avatarUrl} alt={hero!.name}
                        className="w-8 h-8 rounded-full object-cover border border-gold/20" />
                    )}
                    <div>
                      <span className="text-parchment text-sm font-medium">{hero!.name}</span>
                      {hero!.title && (
                        <div className="text-xs text-parchment-dark">{hero!.title}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 英雄名单（无链接版） */}
          {memberHeroes.length === 0 && faction.members.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">代表英雄</h3>
              <div className="flex flex-wrap gap-2">
                {faction.members.map(name => (
                  <span key={name} className="badge bg-dark-600 text-parchment-dark text-xs border border-gold/15">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 外交关系 */}
          {(allies.length > 0 || enemies.length > 0) && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">外交关系</h3>
              {allies.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-jade mb-1">同盟阵营</div>
                  {allies.map(a => (
                    <Link key={a!.id} href={`/factions/${a!.id}`}
                      className="block text-sm text-parchment hover:text-gold transition-colors p-1">
                      {a!.name}
                    </Link>
                  ))}
                </div>
              )}
              {enemies.length > 0 && (
                <div>
                  <div className="text-xs text-crimson mb-1">对立阵营</div>
                  {enemies.map(e => (
                    <Link key={e!.id} href={`/factions/${e!.id}`}
                      className="block text-sm text-parchment hover:text-gold transition-colors p-1">
                      {e!.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card p-4 border-azure/20">
            <a href={`/api/factions/${faction.id}`} target="_blank" rel="noopener noreferrer"
              className="text-xs text-azure-light font-mono hover:text-azure transition-colors">
              GET /api/factions/{faction.id}
            </a>
          </div>
        </aside>

        {/* 右侧主内容区 */}
        <main className="lg:col-span-2 space-y-6">
          {/* 阵营简介 */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gold mb-3">阵营简介</h2>
            <p className="text-parchment leading-relaxed">{faction.description}</p>
          </div>

          {/* 奇迹之力 */}
          {faction.miracle && (
            <div className="card p-6 border border-gold/20 bg-gradient-to-r from-dark-800 to-dark-700">
              <h2 className="text-xl font-bold text-gold mb-3">✦ 奇迹之力</h2>
              <p className="text-parchment-dark leading-relaxed">{faction.miracle}</p>
            </div>
          )}

          {/* 城池/属地详情 */}
          {faction.districts && faction.districts.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gold">城池 / 属地</h2>
              {faction.districts.map((district, idx) => (
                <div key={district.name} id={`district-${encodeURIComponent(district.name)}`}
                  className="card overflow-hidden">
                  {/* 城池标题栏 */}
                  <div className="px-6 py-4 border-b border-gold/10 bg-dark-700/50">
                    <div className="flex items-center gap-3">
                      <span className="text-gold/40 text-sm font-mono">{String(idx + 1).padStart(2, '0')}</span>
                      <h3 className="text-lg font-bold text-parchment">{district.name}</h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* 城池描述 */}
                    {district.description && (
                      <p className="text-parchment-dark leading-relaxed text-sm">{district.description}</p>
                    )}

                    {/* 城池图片 */}
                    {district.images && district.images.length > 0 && (
                      <div className={`grid gap-3 ${district.images.length === 1 ? 'grid-cols-1' : district.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
                        {district.images.map((img, i) => (
                          <div key={i} className="relative rounded-lg overflow-hidden border border-gold/10 bg-dark-900 aspect-video">
                            <img src={img} alt={`${district.name} - ${i + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 子区域详情 */}
                    {district.areas && district.areas.length > 0 && (
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gold/70">
                          <span className="w-4 h-px bg-gold/30" />
                          <span>区域分布</span>
                          <span className="flex-1 h-px bg-gold/10" />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {district.areas.map(area => (
                            <div key={area.name} className="rounded-lg border border-gold/10 bg-dark-800/50 overflow-hidden">
                              {/* 子区域图片（如有） */}
                              {area.images && area.images.length > 0 && (
                                <div className={`grid gap-1 ${area.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                  {area.images.map((img, i) => (
                                    <div key={i} className="relative aspect-video overflow-hidden">
                                      <img src={img} alt={`${area.name} - ${i + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* 子区域文字 */}
                              <div className="p-4">
                                <h4 className="text-sm font-semibold text-parchment mb-1.5">{area.name}</h4>
                                {area.description && (
                                  <p className="text-parchment-dark text-xs leading-relaxed">{area.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {contentHtml && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gold mb-4">详细介绍</h2>
              <div className="lore-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
