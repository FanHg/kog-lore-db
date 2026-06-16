import type { Metadata } from 'next';
import Link from 'next/link';
import { factionDb } from '@/lib/db';
import { FACTION_STATUS_LABELS } from '@/lib/utils';

export const metadata: Metadata = {
  title: '阵营势力',
  description: '王者荣耀世界观中的所有阵营与势力介绍，包括历史背景、成员构成与相互关系。',
};

export const revalidate = 3600;

export default function FactionsPage() {
  const factions = factionDb.getAll();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">阵营势力</h1>
        <p className="text-parchment-dark">
          共收录 <span className="text-gold font-semibold">{factions.length}</span> 个主要阵营的完整资料
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {factions.map(faction => (
          <Link key={faction.id} href={`/factions/${faction.id}`} className="card p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-parchment group-hover:text-gold transition-colors">
                  {faction.name}
                </h2>
                <div className="text-xs text-parchment-dark mt-0.5">{faction.type}</div>
              </div>
              <span className={`badge text-xs border ${
                faction.status === 'active' ? 'bg-jade/20 text-jade border-jade/30' :
                faction.status === 'destroyed' ? 'bg-crimson/20 text-crimson border-crimson/30' :
                'bg-dark-500 text-parchment-dark border-gold/20'
              }`}>
                {FACTION_STATUS_LABELS[faction.status]}
              </span>
            </div>

            <p className="text-parchment-dark text-sm mb-4 line-clamp-3">{faction.description}</p>

            <div className="flex items-center justify-between text-xs text-parchment-dark">
              <span>成员 {faction.members.length} 人</span>
              <div className="flex gap-2">
                {faction.allies.length > 0 && (
                  <span className="text-jade">同盟 {faction.allies.length}</span>
                )}
                {faction.enemies.length > 0 && (
                  <span className="text-crimson">对立 {faction.enemies.length}</span>
                )}
              </div>
            </div>

            {faction.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {faction.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
