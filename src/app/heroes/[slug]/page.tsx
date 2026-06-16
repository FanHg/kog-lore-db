import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { heroDb, factionDb, quoteDb, eventDb, relationDb } from '@/lib/db';
import { RELATION_LABELS, RELATION_COLORS, ROLE_COLORS, BASE_URL, SITE_CONFIG } from '@/lib/utils';
import { marked } from 'marked';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return heroDb.getAllIds().map(id => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hero = heroDb.getById(params.slug);
  if (!hero) return {};
  return {
    title: `${hero.name}·${hero.title}`,
    description: hero.description,
    openGraph: {
      title: `${hero.name} | 王者荣耀世界观数据库`,
      description: hero.description,
      type: 'article',
    },
  };
}

export default function HeroPage({ params }: Props) {
  const hero = heroDb.getById(params.slug);
  if (!hero) notFound();

  const faction = factionDb.getById(hero.faction);
  const quotes = quoteDb.getByHeroId(hero.id);
  const events = eventDb.getByParticipant(hero.id);
  const relations = relationDb.getByHeroId(hero.id);

  const loreHtml = marked(hero.lore, { breaks: true, gfm: true }) as string;

  // Get related hero names for display
  const relatedHeroes = hero.relations.map(r => ({
    ...r,
    hero: heroDb.getById(r.targetId),
  })).filter(r => r.hero);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: hero.name,
    alternateName: hero.alias,
    description: hero.description,
    memberOf: faction ? { '@type': 'Organization', name: faction.name } : undefined,
    url: `${BASE_URL}/heroes/${hero.id}`,
    sameAs: [],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-parchment-dark mb-6">
        <Link href="/" className="hover:text-gold transition-colors">首页</Link>
        <span>/</span>
        <Link href="/heroes" className="hover:text-gold transition-colors">英雄图鉴</Link>
        <span>/</span>
        <span className="text-parchment">{hero.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-5">
          {/* Hero Profile Card */}
          <div className="card p-5">
            <div className="w-full h-48 bg-gradient-to-br from-dark-500 to-dark-600 rounded-lg mb-4 flex items-center justify-center">
              {hero.imageUrl ? (
                <img src={hero.imageUrl} alt={hero.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-6xl">⚔️</span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-parchment mb-1">{hero.name}</h1>
            <div className="text-gold mb-3">{hero.title}</div>

            {hero.alias && hero.alias.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-parchment-dark mb-1">别名</div>
                <div className="flex flex-wrap gap-1">
                  {hero.alias.map(a => (
                    <span key={a} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-parchment-dark">定位</span>
                <div className="flex gap-1">
                  {hero.role.map(r => (
                    <span
                      key={r}
                      className="badge text-xs text-white px-2"
                      style={{ backgroundColor: ROLE_COLORS[r] + '60' }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-parchment-dark">所属阵营</span>
                {faction ? (
                  <Link href={`/factions/${faction.id}`} className="text-gold hover:text-gold-light transition-colors">
                    {faction.name}
                  </Link>
                ) : hero.factionName ? (
                  <span className="text-parchment">{hero.factionName}</span>
                ) : (
                  <span className="text-parchment">{hero.faction}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-parchment-dark">所属阵营</span>
                {faction ? (
                  <Link href={`/factions/${faction.id}`} className="text-gold hover:text-gold-light transition-colors">
                    {faction.name}
                  </Link>
                ) : hero.factionName ? (
                  <span className="text-parchment">{hero.factionName}</span>
                ) : (
                  <span className="text-parchment">{hero.faction}</span>
                )}
              </div>
              {hero.energy && (
                <div className="flex justify-between">
                  <span className="text-parchment-dark">能量类型</span>
                  <span className="text-parchment">{hero.energy}</span>
                </div>
              )}
              {hero.race && (
                <div className="flex justify-between">
                  <span className="text-parchment-dark">种族</span>
                  <span className="text-parchment">{hero.race}</span>
                </div>
              )}
              {hero.city && (
                <div className="flex justify-between">
                  <span className="text-parchment-dark">所在城市</span>
                  <span className="text-parchment">{hero.city}</span>
                </div>
              )}
              {hero.region && (
                <div className="flex justify-between">
                  <span className="text-parchment-dark">所属地域</span>
                  <span className="text-parchment">{hero.region}</span>
                </div>
              )}
              {hero.height && (
                <div className="flex justify-between">
                  <span className="text-parchment-dark">身高</span>
                  <span className="text-parchment">{hero.height}</span>
                </div>
              )}
              {hero.identity && (
                <div className="flex justify-between">
                  <span className="text-parchment-dark">身份</span>
                  <span className="text-parchment">{hero.identity}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mt-4">
              {hero.tags.map(tag => (
                <span key={tag} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Relations */}
          {relatedHeroes.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">人物关系</h3>
              <div className="space-y-2">
                {relatedHeroes.map(rel => (
                  <Link
                    key={rel.targetId}
                    href={`/heroes/${rel.targetId}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-dark-600 transition-colors"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: RELATION_COLORS[rel.type] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-parchment truncate">{rel.hero!.name}</div>
                      <div className="text-xs" style={{ color: RELATION_COLORS[rel.type] }}>
                        {RELATION_LABELS[rel.type]}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/relations" className="text-xs text-gold mt-3 block hover:text-gold-light transition-colors">
                查看完整关系图谱 →
              </Link>
            </div>
          )}

          {/* API Link */}
          <div className="card p-4 border-azure/20">
            <div className="text-xs text-parchment-dark mb-2">🤖 AI 可读 API</div>
            <a
              href={`/api/heroes/${hero.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-azure-light font-mono hover:text-azure transition-colors break-all"
            >
              GET /api/heroes/{hero.id}
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gold mb-3">英雄简介</h2>
            <p className="text-parchment leading-relaxed">{hero.description}</p>
          </div>

          {/* Lore */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gold mb-4">背景故事</h2>
            <div
              className="lore-content"
              dangerouslySetInnerHTML={{ __html: loreHtml }}
            />
          </div>

          {/* Skills */}
          {hero.skills && hero.skills.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gold mb-4">技能说明</h2>
              <div className="space-y-3">
                {hero.skills.map(skill => (
                  <div key={skill.name} className="flex gap-3 p-3 bg-dark-600 rounded-md">
                    <div className="flex-shrink-0 mt-0.5">
                      <span className={`badge text-xs px-2 py-0.5 ${
                        skill.type === 'ultimate' ? 'bg-crimson/30 text-crimson border-crimson/40' :
                        skill.type === 'passive' ? 'bg-jade/20 text-jade border-jade/40' :
                        'bg-azure/20 text-azure-light border-azure/40'
                      } border`}>
                        {skill.type === 'ultimate' ? '大招' : skill.type === 'passive' ? '被动' : '主动'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-parchment text-sm mb-1">{skill.name}</div>
                      <div className="text-parchment-dark text-xs">{skill.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Events */}
          {events.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gold mb-4">参与事件</h2>
              <div className="space-y-3">
                {events.map(event => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex items-start gap-3 p-3 bg-dark-600 rounded-md hover:bg-dark-500 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-parchment hover:text-gold transition-colors text-sm">
                        {event.name}
                      </div>
                      <div className="text-xs text-parchment-dark mt-0.5">{event.era} · {event.date}</div>
                    </div>
                    <span className="badge bg-crimson/20 text-crimson border border-crimson/30 text-xs">
                      {event.type}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Voice Lines */}
          {hero.voiceLines && Object.values(hero.voiceLines).some(v => v && v.trim()) && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gold mb-4">语音台词</h2>
              <div className="space-y-4">
                {hero.voiceLines.move && hero.voiceLines.move.trim() && (
                  <div>
                    <div className="text-xs text-parchment-dark mb-1 font-medium">🏃 移动语音</div>
                    <p className="text-parchment text-sm leading-relaxed whitespace-pre-line">{hero.voiceLines.move}</p>
                  </div>
                )}
                {hero.voiceLines.skill && hero.voiceLines.skill.trim() && (
                  <div>
                    <div className="text-xs text-parchment-dark mb-1 font-medium">⚔️ 技能语音</div>
                    <p className="text-parchment text-sm leading-relaxed whitespace-pre-line">{hero.voiceLines.skill}</p>
                  </div>
                )}
                {hero.voiceLines.interaction && hero.voiceLines.interaction.trim() && (
                  <div>
                    <div className="text-xs text-parchment-dark mb-1 font-medium">💬 互动语音</div>
                    <p className="text-parchment text-sm leading-relaxed whitespace-pre-line">{hero.voiceLines.interaction}</p>
                  </div>
                )}
                {hero.voiceLines.function && hero.voiceLines.function.trim() && (
                  <div>
                    <div className="text-xs text-parchment-dark mb-1 font-medium">🔔 功能语音</div>
                    <p className="text-parchment text-sm leading-relaxed whitespace-pre-line">{hero.voiceLines.function}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quotes */}
          {quotes.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gold mb-4">经典名言</h2>
              <div className="space-y-3">
                {quotes.map(quote => (
                  <blockquote key={quote.id} className="border-l-2 border-gold/40 pl-4 py-1">
                    <p className="text-parchment italic">「{quote.text}」</p>
                    {quote.context && (
                      <p className="text-xs text-parchment-dark mt-1">—— {quote.context}</p>
                    )}
                  </blockquote>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
