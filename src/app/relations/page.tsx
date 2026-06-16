import type { Metadata } from 'next';
import { relationDb } from '@/lib/db';
import RelationGraphClient from '@/components/RelationGraphClient';

export const metadata: Metadata = {
  title: '英雄关系图谱',
  description: '王者荣耀英雄之间的完整关系网络可视化，包含盟友、敌对、恋人、师徒等多种关系类型。',
};

export const revalidate = 3600;

export default function RelationsPage() {
  const graphData = relationDb.getGraphData();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gold mb-2">英雄关系图谱</h1>
        <p className="text-parchment-dark">
          可视化展示 {graphData.nodes.length} 位英雄之间 {graphData.edges.length} 条关系
        </p>
      </div>
      <RelationGraphClient graphData={graphData} />
    </>
  );
}
