import type { Metadata } from 'next';
import Link from 'next/link';
import { videoTopicDb, heroDb } from '@/lib/db';

export const metadata: Metadata = {
  title: '视频话题库',
  description: '王者荣耀世界观视频选题库，涵盖英雄故事解析、阵营关系梳理、时间线推演等话题方向。',
};

export const revalidate = 3600;

const STATUS_LABELS = { idea: '创意', draft: '草稿', published: '已发布' };
const STATUS_COLORS = {
  idea: 'bg-azure/20 text-azure-light border-azure/30',
  draft: 'bg-gold/20 text-gold border-gold/30',
  published: 'bg-jade/20 text-jade border-jade/30',
};
const TYPE_LABELS = {
  lore: '世界观解析', analysis: '深度分析', comparison: '横向对比',
  timeline: '时间线', speculation: '推理猜想',
};

export default function VideoTopicsPage() {
  const topics = videoTopicDb.getAll();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">视频话题库</h1>
        <p className="text-parchment-dark">
          共收录 <span className="text-gold font-semibold">{topics.length}</span> 个世界观视频选题
        </p>
      </div>

      <div className="space-y-5">
        {topics.map(topic => {
          const heroNames = topic.heroIds
            .map(id => heroDb.getById(id)?.name)
            .filter(Boolean).join('、');

          return (
            <div key={topic.id} className="card p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`badge text-xs border ${STATUS_COLORS[topic.status]}`}>
                  {STATUS_LABELS[topic.status]}
                </span>
                <span className="badge bg-dark-500 text-parchment-dark border border-gold/20 text-xs">
                  {TYPE_LABELS[topic.type]}
                </span>
              </div>

              <h2 className="text-xl font-bold text-parchment mb-2">{topic.title}</h2>
              <p className="text-parchment-dark text-sm mb-4 leading-relaxed">{topic.description}</p>

              {heroNames && (
                <div className="text-sm mb-3">
                  <span className="text-parchment-dark">涉及英雄：</span>
                  <span className="text-parchment">{heroNames}</span>
                </div>
              )}

              {topic.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {topic.keywords.map(kw => (
                    <span key={kw} className="badge bg-dark-600 text-parchment-dark text-xs border border-gold/10">
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              {topic.outline && (
                <details className="mt-3">
                  <summary className="text-sm text-gold cursor-pointer hover:text-gold-light transition-colors">
                    查看视频大纲
                  </summary>
                  <pre className="mt-2 text-parchment-dark text-xs whitespace-pre-wrap leading-relaxed bg-dark-600 p-3 rounded">
                    {topic.outline}
                  </pre>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
