import type { Metadata } from 'next';
import Link from 'next/link';
import { organizationDb, heroDb, factionDb } from '@/lib/db';

export const metadata: Metadata = {
  title: '组织机构',
  description: '王者荣耀世界观中的各类组织机构，包括军队、秘密组织、修会等详细介绍。',
};

export const revalidate = 3600;

export default function OrganizationsPage() {
  const orgs = organizationDb.getAll();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">组织机构</h1>
        <p className="text-parchment-dark">
          共收录 <span className="text-gold font-semibold">{orgs.length}</span> 个主要组织
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {orgs.map(org => {
          const faction = org.faction ? factionDb.getById(org.faction) : null;
          return (
            <div key={org.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-parchment">{org.name}</h2>
                  <div className="text-xs text-parchment-dark mt-0.5">{org.type}</div>
                </div>
                <span className={`badge text-xs border ${
                  org.status === 'active' ? 'bg-jade/20 text-jade border-jade/30' :
                  org.status === 'disbanded' ? 'bg-crimson/20 text-crimson border-crimson/30' :
                  'bg-dark-500 text-parchment-dark border-gold/20'
                }`}>
                  {org.status === 'active' ? '活跃' : org.status === 'disbanded' ? '解散' :
                   org.status === 'secret' ? '秘密' : '传说'}
                </span>
              </div>
              <p className="text-parchment-dark text-sm mb-3">{org.description}</p>
              {faction && (
                <div className="text-xs text-parchment-dark">
                  隶属：<Link href={`/factions/${faction.id}`} className="text-gold hover:text-gold-light">{faction.name}</Link>
                </div>
              )}
              <div className="text-xs text-parchment-dark mt-1">目标：{org.purpose}</div>
              <div className="flex flex-wrap gap-1 mt-3">
                {org.tags.map(tag => (
                  <span key={tag} className="badge bg-dark-500 text-parchment-dark text-xs border border-gold/10">#{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
