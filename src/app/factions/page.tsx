import type { Metadata } from 'next';
import Link from 'next/link';
import { factionDb } from '@/lib/db';

export const metadata: Metadata = {
  title: '阵营势力',
  description: '王者荣耀世界观中的9大地区阵营介绍，包括逐鹿、建木、大河流域、三分之地、河洛、北荒、云中漠地、日落海、扶桑的历史背景与城池分布。',
};

export const revalidate = 3600;

export default function FactionsPage() {
  const factions = factionDb.getAll();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">王者大陆阵营</h1>
        <p className="text-parchment-dark">
          共收录 <span className="text-gold font-semibold">{factions.length}</span> 个主要地区阵营的完整资料
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
                <div className="text-xs text-parchment-dark mt-0.5">
                  {faction.districts && faction.districts.length > 0
                    ? `${faction.districts.length} 个城池/属地`
                    : '地区阵营'}
                </div>
              </div>
              <span className="badge text-xs border bg-jade/20 text-jade border-jade/30">
                活跃
              </span>
            </div>

            <p className="text-parchment-dark text-sm mb-4 line-clamp-3">{faction.description}</p>

            {/* 城池列表预览 */}
            {faction.districts && faction.districts.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {faction.districts.slice(0, 3).map(d => (
                  <span key={d.name} className="badge bg-dark-600 text-parchment-dark text-xs border border-gold/15">
                    {d.name}
                  </span>
                ))}
                {faction.districts.length > 3 && (
                  <span className="badge bg-dark-600 text-parchment-dark text-xs border border-gold/15">
                    +{faction.districts.length - 3}
                  </span>
                )}
              </div>
            )}

            {faction.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
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
