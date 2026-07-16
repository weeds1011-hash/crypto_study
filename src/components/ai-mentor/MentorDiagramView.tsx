"use client";

import type { MentorDiagram } from "@/features/ai-mentor/diagram";
import { isAllowedDiagram } from "@/features/ai-mentor/diagram";

export function MentorDiagramView({ diagram, forceFallback = false }: { diagram: MentorDiagram; forceFallback?: boolean }) {
  const allowed = isAllowedDiagram(diagram);
  if (!allowed || forceFallback) {
    return <FallbackPath path={diagram.fallbackPath} reason={allowed ? "다이어그램 렌더링을 사용할 수 없어 텍스트 경로로 표시합니다." : "허용되지 않은 노드가 있어 텍스트 경로로 표시합니다."} />;
  }

  const width = 720;
  const height = 190;
  const nodeWidth = 96;
  const gap = (width - nodeWidth * diagram.nodes.length) / (diagram.nodes.length + 1);

  return (
    <div className="mt-3 overflow-x-auto rounded-md border border-line bg-paper p-3" aria-label="AI Mentor 돈의 흐름 시각 다이어그램">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="mentor-diagram-title" className="h-auto min-w-[620px] max-w-full">
        <title id="mentor-diagram-title">{diagram.title}</title>
        <defs>
          <marker id="mentor-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#245a9b" />
          </marker>
        </defs>
        {diagram.edges.map((edge) => {
          const sourceIndex = diagram.nodes.findIndex((node) => node.id === edge.source);
          const targetIndex = diagram.nodes.findIndex((node) => node.id === edge.target);
          const x1 = gap + sourceIndex * (nodeWidth + gap) + nodeWidth;
          const x2 = gap + targetIndex * (nodeWidth + gap);
          const y = 80;
          return (
            <g key={`${edge.source}-${edge.target}`}>
              <line x1={x1} y1={y} x2={x2 - 8} y2={y} stroke="#245a9b" strokeWidth="3" markerEnd="url(#mentor-arrow)" />
              <text x={(x1 + x2) / 2} y={y - 14} textAnchor="middle" className="fill-muted text-[11px] font-bold">
                {edge.label}
              </text>
            </g>
          );
        })}
        {diagram.nodes.map((node, index) => {
          const x = gap + index * (nodeWidth + gap);
          return (
            <g key={node.id}>
              <rect x={x} y="55" width={nodeWidth} height="50" rx="8" fill="#f6f7f1" stroke="#dfe4dc" strokeWidth="2" />
              <text x={x + nodeWidth / 2} y="84" textAnchor="middle" className="fill-ink text-[13px] font-black">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-xs font-bold text-muted">Mermaid 원본은 허용된 노드와 엣지에서만 생성됩니다.</p>
    </div>
  );
}

function FallbackPath({ path, reason }: { path: string; reason: string }) {
  return (
    <div className="mt-3 rounded-md border border-line bg-paper p-4">
      <p className="text-sm font-bold text-muted">{reason}</p>
      <p className="mt-2 text-sm font-black text-ink">{path}</p>
    </div>
  );
}
