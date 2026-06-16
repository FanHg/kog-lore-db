import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { factionDb, heroDb, eventDb, locationDb } from '@/lib/db';
import { FACTION_STATUS_LABELS } from '@/lib/utils';
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
    title: faction.name,
    description: faction.description,
  };
}

export default function FactionPage({ params }: Props) {
  const faction = factionDb.getById(params.slug);
  if (!faction) notFound();

  const members = faction.members.map(id => heroDb.getById(id)).filter(Boolean);
  const allies = faction.allies.map(id => factionDb.getById(id)).filter(Boolean);
  const enemies = faction.enemies.map(id => factionDb.getById(id)).filter(Boolean);
  const location = faction.location ? locationDb.getById(faction.location) : null;
  const contentHtml = marked(faction.content, { breaks: true, gfm: true }) as string;

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
        <aside className="lg:col-span-1 space-y-5">
          <div className="card p-5">
            <h1 className="text-2xl font-bold text-parchment mb-1">{faction.name}</h1>
            <div className="flex gap-2 mb-4">
              <span className="badge bg-dark-500 text-parchment-dark border border-gold/20 text-xs">
                {faction.type}
              </span>
              <span className={`badge text-xs border ${
                faction.status === 'active' ? 'bg-jade/20 text-jade border-jade/30' : 'bg-dark-500 text-parchment-dark border-gold/20'
              }`}>
                {FACTION_STATUS_LABELS[faction.status]}
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

            <div className="flex flex-wrap gap-1 mt-3">
              {faction.tags.map(tag => (
                <span key={tag} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Members */}
          {members.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">成员英雄 ({members.length})</h3>
              <div className="space-y-2">
                {members.map(hero => (
                  <Link key={hero!.id} href={`/heroes/${hero!.id}`} className="flex items-center gap-2 p-2 rounded hover:bg-dark-600 transition-colors">
                    <span className="text-parchment text-sm font-medium">{hero!.name}</span>
                    <span className="text-xs text-parchment-dark">{hero!.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Allies & Enemies */}
          {(allies.length > 0 || enemies.length > 0) && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">外交关系</h3>
              {allies.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-jade mb-1">同盟阵营</div>
                  {allies.map(a => (
                    <Link key={a!.id} href={`/factions/${a!.id}`} className="block text-sm text-parchment hover:text-gold transition-colors p-1">
                      {a!.name}
                    </Link>
                  ))}
                </div>
              )}
              {enemies.length > 0 && (
                <div>
                  <div className="text-xs text-crimson mb-1">对立阵营</div>
                  {enemies.map(e => (
                    <Link key={e!.id} href={`/factions/${e!.id}`} className="block text-sm text-parchment hover:text-gold transition-colors p-1">
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

        <main className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gold mb-3">阵营简介</h2>
            <p className="text-parchment leading-relaxed">{faction.description}</p>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gold mb-4">详细介绍</h2>
            <div className="lore-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </main>
      </div>
    </>
  );
}
