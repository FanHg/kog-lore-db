import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { eventDb, heroDb, factionDb, locationDb } from '@/lib/db';
import { EVENT_TYPE_LABELS } from '@/lib/utils';
import { marked } from 'marked';

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return eventDb.getAllIds().map(id => ({ slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = eventDb.getById(params.slug);
  if (!event) return {};
  return { title: event.name, description: event.description };
}

export default function EventPage({ params }: Props) {
  const event = eventDb.getById(params.slug);
  if (!event) notFound();

  const participants = event.participants.map(id => heroDb.getById(id)).filter(Boolean);
  const factions = event.factions.map(id => factionDb.getById(id)).filter(Boolean);
  const locations = event.locations.map(id => locationDb.getById(id)).filter(Boolean);
  const contentHtml = marked(event.content, { breaks: true, gfm: true }) as string;

  return (
    <>
      <nav className="flex items-center gap-2 text-sm text-parchment-dark mb-6">
        <Link href="/" className="hover:text-gold transition-colors">首页</Link>
        <span>/</span>
        <Link href="/events" className="hover:text-gold transition-colors">历史事件</Link>
        <span>/</span>
        <span className="text-parchment">{event.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 space-y-5">
          <div className="card p-5">
            <h1 className="text-xl font-bold text-parchment mb-3">{event.name}</h1>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-parchment-dark">纪元</span>
                <span className="text-crimson">{event.era}</span>
              </div>
              {event.date && (
                <div className="flex justify-between">
                  <span className="text-parchment-dark">时间</span>
                  <span className="text-parchment">{event.date}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-parchment-dark">类型</span>
                <span className="text-parchment">{EVENT_TYPE_LABELS[event.type]}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-4">
              {event.tags.map(tag => (
                <span key={tag} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">#{tag}</span>
              ))}
            </div>
          </div>

          {participants.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">参与英雄</h3>
              {participants.map(h => (
                <Link key={h!.id} href={`/heroes/${h!.id}`} className="flex items-center gap-2 p-2 rounded hover:bg-dark-600 transition-colors">
                  <span className="text-parchment text-sm">{h!.name}</span>
                  <span className="text-xs text-parchment-dark">{h!.title}</span>
                </Link>
              ))}
            </div>
          )}

          {factions.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">涉及阵营</h3>
              {factions.map(f => (
                <Link key={f!.id} href={`/factions/${f!.id}`} className="block p-2 rounded hover:bg-dark-600 transition-colors text-sm text-parchment hover:text-gold">
                  {f!.name}
                </Link>
              ))}
            </div>
          )}

          {locations.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gold mb-3">发生地点</h3>
              {locations.map(l => (
                <Link key={l!.id} href={`/locations/${l!.id}`} className="block p-2 rounded hover:bg-dark-600 transition-colors text-sm text-parchment hover:text-gold">
                  {l!.name}
                </Link>
              ))}
            </div>
          )}
        </aside>

        <main className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gold mb-3">事件概述</h2>
            <p className="text-parchment leading-relaxed">{event.description}</p>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gold mb-4">详细经过</h2>
            <div className="lore-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </main>
      </div>
    </>
  );
}
