'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { RELATION_COLORS, RELATION_LABELS } from '@/lib/utils';
import type { GraphData, GraphNode, GraphEdge } from '@/lib/types';

interface RelationGraphProps {
  graphData: GraphData;
}

const WIDTH = 700;
const HEIGHT = 500;
const NODE_RADIUS = 28;

function layoutNodes(nodes: GraphNode[]): GraphNode[] {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const r = Math.min(WIDTH, HEIGHT) / 2 - NODE_RADIUS - 20;

  return nodes.map((node, i: number) => {
    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
    return {
      ...node,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

export default function RelationGraphClient({ graphData }: RelationGraphProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);

  const nodes = layoutNodes(graphData.nodes);
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  const getNodeEdges = useCallback((nodeId: string) => {
    return graphData.edges.filter(e => e.source === nodeId || e.target === nodeId);
  }, [graphData.edges]);

  const selectedEdges = selectedNode ? getNodeEdges(selectedNode) : [];
  const highlightedNodes = new Set<string>(
    selectedNode ? [selectedNode, ...selectedEdges.map(e => e.source === selectedNode ? e.target : e.source)] : []
  );

  return (
    <div className="card p-4">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full max-w-3xl mx-auto"
          style={{ minWidth: 400, height: 'auto' }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {graphData.edges.map((edge, idx) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const isHighlighted = !selectedNode || (
              edge.source === selectedNode || edge.target === selectedNode
            );
            const isHovered = hoveredEdge === edge;
            const color = RELATION_COLORS[edge.type] || '#6A7080';
            const opacity = isHighlighted ? (isHovered ? 1 : 0.7) : 0.15;

            // Calculate midpoint for label
            const mx = (source.x! + target.x!) / 2;
            const my = (source.y! + target.y!) / 2;

            return (
              <g key={idx}>
                <line
                  x1={source.x} y1={source.y}
                  x2={target.x} y2={target.y}
                  stroke={color}
                  strokeWidth={isHovered ? 3 : 1.5}
                  strokeOpacity={opacity}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={() => setHoveredEdge(edge)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
                {isHovered && (
                  <text x={mx} y={my - 6} textAnchor="middle" fill={color} fontSize="11" className="pointer-events-none">
                    {RELATION_LABELS[edge.type]}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNode === node.id;
            const isHighlighted = !selectedNode || highlightedNodes.has(node.id);
            const opacity = isHighlighted ? 1 : 0.3;

            return (
              <g
                key={node.id}
                style={{ cursor: 'pointer', opacity, transition: 'all 0.2s' }}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              >
                {/* Glow ring for selected */}
                {isSelected && (
                  <circle
                    cx={node.x} cy={node.y} r={NODE_RADIUS + 8}
                    fill="none" stroke="#D4A017" strokeWidth="2" strokeOpacity="0.5"
                    filter="url(#glow)"
                  />
                )}
                <circle
                  cx={node.x} cy={node.y} r={NODE_RADIUS}
                  fill={isSelected ? '#1E2640' : '#0F1525'}
                  stroke={isSelected ? '#D4A017' : '#263050'}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text
                  x={node.x} y={node.y}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isSelected ? '#F0C040' : '#E8DCC8'}
                  fontSize="13" fontWeight={isSelected ? 'bold' : 'normal'}
                  className="pointer-events-none select-none"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-dark-600 rounded-lg border border-gold/20 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <Link href={`/heroes/${selectedNode}`} className="font-bold text-gold hover:text-gold-light transition-colors">
              {nodeMap.get(selectedNode)?.name} →
            </Link>
            <button onClick={() => setSelectedNode(null)} className="text-parchment-dark hover:text-parchment text-sm">
              ✕ 取消选中
            </button>
          </div>
          {selectedEdges.length > 0 ? (
            <div className="space-y-2">
              {selectedEdges.map((edge, i) => {
                const otherId = edge.source === selectedNode ? edge.target : edge.source;
                const other = nodeMap.get(otherId);
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RELATION_COLORS[edge.type] }} />
                    <Link href={`/heroes/${otherId}`} className="text-parchment hover:text-gold transition-colors">
                      {other?.name}
                    </Link>
                    <span className="text-parchment-dark text-xs" style={{ color: RELATION_COLORS[edge.type] }}>
                      {RELATION_LABELS[edge.type]}
                    </span>
                    <span className="text-parchment-dark text-xs flex-1">{edge.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-parchment-dark text-sm">暂无关系数据</p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {(['ally', 'enemy', 'lover', 'rival', 'mentor'] as const).map(type => (
          <div key={type} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RELATION_COLORS[type] }} />
            <span className="text-parchment-dark">{RELATION_LABELS[type]}</span>
          </div>
        ))}
        <span className="text-parchment-dark ml-auto">点击英雄节点查看关系</span>
      </div>
    </div>
  );
}
