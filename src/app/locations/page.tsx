import type { Metadata } from 'next';
import Link from 'next/link';
import { locationDb } from '@/lib/db';

export const metadata: Metadata = {
  title: '地点地图',
  description: '王者荣耀世界观中的所有重要地点，包括城市、圣地、战场、遗迹等详细介绍。',
};

export const revalidate = 3600;

const TYPE_ICONS: Record<string, string> = {
  city: '🏙️', region: '🗺️', realm: '🌌', dungeon: '⚫',
  battlefield: '⚔️', sacred: '✨', ruins: '🏚️', natural: '🌿',
};

const TYPE_LABELS: Record<string, string> = {
  city: '城市', region: '地区', realm: '界域', dungeon: '地下城',
  battlefield: '战场', sacred: '圣地', ruins: '遗迹', natural: '自然地貌',
};

export default function LocationsPage() {
  const locations = locationDb.getAll();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">地点地图</h1>
        <p className="text-parchment-dark">
          共收录 <span className="text-gold font-semibold">{locations.length}</span> 个重要地点
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map(loc => (
          <Link key={loc.id} href={`/locations/${loc.id}`} className="card p-5 group">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{TYPE_ICONS[loc.type] || '📍'}</span>
              <div>
                <h2 className="font-bold text-parchment group-hover:text-gold transition-colors">{loc.name}</h2>
                <span className="text-xs text-parchment-dark">{TYPE_LABELS[loc.type]}</span>
              </div>
            </div>
            <p className="text-parchment-dark text-sm line-clamp-3 mb-3">{loc.description}</p>
            <div className="flex flex-wrap gap-1">
              {loc.tags.slice(0, 3).map(tag => (
                <span key={tag} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">#{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
