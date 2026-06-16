import type { Metadata } from 'next';
import Link from 'next/link';
import { eventDb } from '@/lib/db';
import { EVENT_TYPE_LABELS } from '@/lib/utils';

export const metadata: Metadata = {
  title: '历史事件',
  description: '王者荣耀世界观中改变历史走向的重大事件，涵盖战役、政治事变、神祇降临等各类历史节点。',
};

export const revalidate = 3600;

export default function EventsPage() {
  const events = eventDb.getAll();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">历史事件</h1>
        <p className="text-parchment-dark">
          共收录 <span className="text-gold font-semibold">{events.length}</span> 个重要历史事件
        </p>
      </div>

      <div className="space-y-4">
        {events.map(event => (
          <Link key={event.id} href={`/events/${event.id}`} className="card p-5 group block">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="badge bg-crimson/20 text-crimson border border-crimson/30 text-xs">
                {event.era}
              </span>
              {event.date && (
                <span className="text-xs text-parchment-dark">{event.date}</span>
              )}
              <span className="badge bg-dark-500 text-parchment-dark border border-gold/20 text-xs">
                {EVENT_TYPE_LABELS[event.type]}
              </span>
            </div>
            <h2 className="text-lg font-bold text-parchment group-hover:text-gold transition-colors mb-2">
              {event.name}
            </h2>
            <p className="text-parchment-dark text-sm mb-3 line-clamp-2">{event.description}</p>
            {event.participants.length > 0 && (
              <div className="text-xs text-parchment-dark">
                参与英雄：{event.participants.join('、')}
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
