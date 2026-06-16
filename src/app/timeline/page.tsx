import type { Metadata } from 'next';
import Link from 'next/link';
import { timelineDb, eventDb } from '@/lib/db';
import { EVENT_TYPE_LABELS } from '@/lib/utils';

export const metadata: Metadata = {
  title: '历史时间线',
  description: '王者荣耀世界观完整时间线，从创世纪元到当世，记录每个重要时期与关键历史事件。',
};

export const revalidate = 3600;

export default function TimelinePage() {
  const timeline = timelineDb.getAll();
  const allEvents = eventDb.getAll();

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gold mb-2">历史时间线</h1>
        <p className="text-parchment-dark">王者大陆纪年史，从创世到当世的完整历史演进</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent" />

        <div className="space-y-10 pl-16 relative">
          {timeline.map((entry, idx) => {
            const entryEvents = entry.events
              .map(id => allEvents.find(e => e.id === id))
              .filter(Boolean);

            return (
              <div key={entry.id} className="relative animate-fade-in">
                {/* Timeline dot */}
                <div
                  className="absolute -left-12 top-1 w-5 h-5 rounded-full border-2 border-dark-900 flex items-center justify-center"
                  style={{ backgroundColor: entry.color || '#D4A017' }}
                >
                  <div className="w-2 h-2 rounded-full bg-dark-900" />
                </div>

                <div className="card p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className="text-sm font-semibold px-3 py-0.5 rounded-full"
                      style={{
                        backgroundColor: (entry.color || '#D4A017') + '20',
                        color: entry.color || '#D4A017',
                        border: `1px solid ${(entry.color || '#D4A017')}40`,
                      }}
                    >
                      {entry.era}
                    </span>
                    <span className="text-parchment-dark text-sm">{entry.period}</span>
                  </div>

                  <h2 className="text-xl font-bold text-parchment mb-3">{entry.name}</h2>
                  <p className="text-parchment-dark text-sm leading-relaxed mb-4">{entry.description}</p>

                  {entryEvents.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-parchment-dark uppercase tracking-wider mb-2">
                        重要事件
                      </h3>
                      {entryEvents.map(event => (
                        <Link
                          key={event!.id}
                          href={`/events/${event!.id}`}
                          className="flex items-center gap-3 p-3 bg-dark-600 rounded-md hover:bg-dark-500 transition-colors"
                        >
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: entry.color || '#D4A017' }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-parchment hover:text-gold transition-colors">
                              {event!.name}
                            </div>
                            <div className="text-xs text-parchment-dark mt-0.5 line-clamp-1">
                              {event!.description}
                            </div>
                          </div>
                          <span className="badge bg-dark-400 text-parchment-dark text-xs border border-gold/10">
                            {EVENT_TYPE_LABELS[event!.type]}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
