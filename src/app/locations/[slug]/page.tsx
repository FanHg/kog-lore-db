import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { locationDb, factionDb, heroDb } from '@/lib/db';
import { marked } from 'marked';

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return locationDb.getAllIds().map(id => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = locationDb.getById(params.slug);
  if (!loc) return {};
  return { title: loc.name, description: loc.description };
}

export default function LocationPage({ params }: Props) {
  const loc = locationDb.getById(params.slug);
  if (!loc) notFound();

  const faction = loc.faction ? factionDb.getById(loc.faction) : null;
  const inhabitants = loc.inhabitants.map(id => heroDb.getById(id)).filter(Boolean);
  const contentHtml = marked(loc.content, { breaks: true, gfm: true }) as string;

  return (
    <>
      <nav className="flex items-center gap-2 text-sm text-parchment-dark mb-6">
        <Link href="/" className="hover:text-gold transition-colors">首页</Link>
        <span>/</span>
        <Link href="/locations" className="hover:text-gold transition-colors">地点地图</Link>
        <span>/</span>
        <span className="text-parchment">{loc.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 space-y-5">
          <div className="card p-5">
            <h1 className="text-2xl font-bold text-parchment mb-3">{loc.name}</h1>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-parchment-dark">类型</span>
                <span className="text-parchment">{loc.type}</span>
              </div>
              {faction && (
                <div className="flex justify-between">
                  <span className="text-parchment-dark">控制阵营</span>
                  <Link href={`/factions/${faction.id}`} className="text-gold hover:text-gold-light">{faction.name}</Link>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-4">
              {loc.tags.map(tag => (
                <span key={tag} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">#{tag}</span>
              ))}
            </div>
          </div>

          {inhabitants.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">居住英雄</h3>
              {inhabitants.map(h => (
                <Link key={h!.id} href={`/heroes/${h!.id}`} className="block p-2 text-sm text-parchment hover:text-gold transition-colors rounded hover:bg-dark-600">
                  {h!.name} · {h!.title}
                </Link>
              ))}
            </div>
          )}
        </aside>

        <main className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gold mb-3">地点简介</h2>
            <p className="text-parchment leading-relaxed">{loc.description}</p>
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
