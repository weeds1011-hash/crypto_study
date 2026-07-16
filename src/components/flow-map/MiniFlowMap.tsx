"use client";

import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import type { FlowSignal } from "@/types";

function edgeColor(direction: FlowSignal["direction"]) {
  if (direction === "inflow") return "#167a5a";
  if (direction === "outflow") return "#b84c42";
  if (direction === "neutral") return "#b98520";
  return "#59665e";
}

export function MiniFlowMap({ signals }: { signals: FlowSignal[] }) {
  const [selected, setSelected] = useState(signals[0]);
  const nodes = useMemo<Node[]>(
    () => [
      { id: "거시경제", position: { x: 0, y: 70 }, data: { label: "거시경제" }, style: nodeStyle },
      { id: "위험자산", position: { x: 220, y: 10 }, data: { label: "위험자산" }, style: nodeStyle },
      { id: "암호화폐 시장", position: { x: 440, y: 70 }, data: { label: "암호화폐 시장" }, style: nodeStyle },
      { id: "알트코인·DeFi", position: { x: 700, y: 10 }, data: { label: "알트코인·DeFi" }, style: nodeStyle },
      { id: "스테이블코인", position: { x: 440, y: 190 }, data: { label: "스테이블코인" }, style: secondaryNodeStyle },
      { id: "거래소·체인", position: { x: 700, y: 190 }, data: { label: "거래소·체인" }, style: secondaryNodeStyle },
    ],
    [],
  );

  const edges = useMemo<Edge[]>(
    () =>
      signals.map((signal) => ({
        id: signal.id,
        source: signal.sourceNode,
        target: signal.targetNode,
        label: `${signal.direction} ${signal.strength}/3`,
        animated: signal.direction === "inflow" || signal.direction === "outflow",
        style: { stroke: edgeColor(signal.direction), strokeWidth: 3 },
        labelStyle: { fill: "#17211b", fontWeight: 800 },
      })),
    [signals],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="h-[360px] rounded-lg border border-line bg-panel">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onEdgeClick={(_, edge) => {
            const next = signals.find((signal) => signal.id === edge.id);
            if (next) setSelected(next);
          }}
        >
          <Background color="#dfe4dc" gap={18} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <aside className="rounded-lg border border-line bg-ink p-5 text-white">
        <p className="text-xs font-black uppercase text-[#9ed0bd]">Signal Detail</p>
        <h3 className="mt-2 text-2xl font-black">
          {selected.sourceNode} → {selected.targetNode}
        </h3>
        <p className="mt-2 text-sm font-bold text-[#dfe8df]">
          방향: {selected.direction} · 강도: {selected.strength}/3 · 신뢰도: {selected.confidence}
        </p>
        <p className="mt-2 text-sm font-bold text-[#dfe8df]">
          점수: {selected.score} · 데이터 확보율: {(selected.dataCoverage * 100).toFixed(0)}% · 실데이터 비율: {(selected.liveMetricRatio * 100).toFixed(0)}%
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <h4 className="font-black">판단 근거</h4>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[#dfe8df]">
              {selected.reasons.length ? selected.reasons.map((item) => <li key={`${item.metricId}-${item.score}`}>{item.explanation}</li>) : <li>계산에 사용할 수 있는 실데이터 근거가 부족합니다.</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-black">반대 신호</h4>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-[#dfe8df]">
              {selected.counterSignals.length ? selected.counterSignals.map((item) => <li key={`${item.metricId}-${item.score}`}>{item.explanation}</li>) : <li>현재 규칙에서는 강한 반대 신호가 없습니다.</li>}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

const nodeStyle = {
  border: "1px solid #dfe4dc",
  borderRadius: 8,
  padding: 12,
  width: 160,
  fontWeight: 900,
  color: "#17211b",
};

const secondaryNodeStyle = {
  ...nodeStyle,
  background: "#f6f7f1",
  color: "#245a9b",
};
