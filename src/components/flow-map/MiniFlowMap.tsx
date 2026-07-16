"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import type { FlowSignal } from "@/types";

const statusText = {
  inflow: "유입",
  outflow: "유출",
  neutral: "중립",
  uncertain: "보류",
};

const statusIcon = {
  inflow: "↘",
  outflow: "↗",
  neutral: "•",
  uncertain: "?",
};

function edgeColor(direction: FlowSignal["direction"]) {
  if (direction === "inflow") return "#167a5a";
  if (direction === "outflow") return "#b84c42";
  if (direction === "neutral") return "#b98520";
  return "#59665e";
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function signalFor(signals: FlowSignal[], id: string) {
  return signals.find((signal) => signal.id === id);
}

function nodeStatus(signals: FlowSignal[], node: string): FlowSignal["direction"] {
  const related = signals.filter((signal) => signal.sourceNode === node || signal.targetNode === node);
  if (related.some((signal) => signal.direction === "outflow")) return "outflow";
  if (related.some((signal) => signal.direction === "inflow")) return "inflow";
  if (related.some((signal) => signal.direction === "neutral")) return "neutral";
  return "uncertain";
}

function NodeLabel({ title, status }: { title: string; status: FlowSignal["direction"] }) {
  return (
    <div aria-label={`${title} 상태: ${statusText[status]}`} className="grid gap-1 text-left">
      <strong>{title}</strong>
      <span className="text-xs font-black">
        {statusIcon[status]} {statusText[status]}
      </span>
    </div>
  );
}

function visualEdge(id: string, source: string, target: string, signal?: FlowSignal): Edge {
  const direction = signal?.direction ?? "uncertain";
  return {
    id,
    source,
    target,
    label: statusText[direction],
    animated: direction === "inflow" || direction === "outflow",
    style: { stroke: edgeColor(direction), strokeWidth: 2, strokeDasharray: "6 5" },
    labelStyle: { fill: "#17211b", fontWeight: 800 },
  };
}

export function MiniFlowMap({ signals }: { signals: FlowSignal[] }) {
  const [selected, setSelected] = useState(signals[0]);
  const reducedMotion = useReducedMotion();
  const nodes = useMemo<Node[]>(
    () => [
      { id: "거시경제", position: { x: 0, y: 120 }, data: { label: <NodeLabel title="거시경제" status={nodeStatus(signals, "거시경제")} /> }, style: nodeStyle },
      { id: "위험자산", position: { x: 210, y: 120 }, data: { label: <NodeLabel title="위험자산" status={nodeStatus(signals, "위험자산")} /> }, style: nodeStyle },
      { id: "암호화폐 시장", position: { x: 420, y: 120 }, data: { label: <NodeLabel title="암호화폐 시장" status={nodeStatus(signals, "암호화폐 시장")} /> }, style: nodeStyle },
      { id: "BTC", position: { x: 640, y: 30 }, data: { label: <NodeLabel title="BTC" status={signalFor(signals, "crypto-to-alts")?.direction ?? "uncertain"} /> }, style: nodeStyle },
      { id: "ETH", position: { x: 850, y: 30 }, data: { label: <NodeLabel title="ETH" status={signalFor(signals, "exchange-chain-to-alts")?.direction ?? "uncertain"} /> }, style: nodeStyle },
      { id: "알트코인", position: { x: 1060, y: 30 }, data: { label: <NodeLabel title="알트코인" status={nodeStatus(signals, "알트코인·DeFi")} /> }, style: nodeStyle },
      { id: "DeFi", position: { x: 1270, y: 30 }, data: { label: <NodeLabel title="DeFi" status={nodeStatus(signals, "알트코인·DeFi")} /> }, style: nodeStyle },
      { id: "스테이블코인", position: { x: 640, y: 230 }, data: { label: <NodeLabel title="스테이블코인" status={nodeStatus(signals, "스테이블코인")} /> }, style: secondaryNodeStyle },
      { id: "거래소·체인", position: { x: 870, y: 230 }, data: { label: <NodeLabel title="거래소·체인" status={nodeStatus(signals, "거래소·체인")} /> }, style: secondaryNodeStyle },
    ],
    [signals],
  );

  const edges = useMemo<Edge[]>(() => {
    const signalEdges: Edge[] = signals.map((signal) => ({
      id: signal.id,
      source: signal.sourceNode,
      target: signal.targetNode,
      label: `${statusText[signal.direction]} ${signal.strength}/3`,
      animated: !reducedMotion && (signal.direction === "inflow" || signal.direction === "outflow"),
      style: { stroke: edgeColor(signal.direction), strokeWidth: 3 },
      labelStyle: { fill: "#17211b", fontWeight: 800 },
    }));

    const crypto = signalFor(signals, "crypto-to-alts");
    const chain = signalFor(signals, "exchange-chain-to-alts");
    const stable = signalFor(signals, "stablecoins-to-crypto");
    const visualEdges: Edge[] = [
      visualEdge("market-to-btc", "암호화폐 시장", "BTC", crypto),
      visualEdge("btc-to-eth", "BTC", "ETH", crypto),
      visualEdge("eth-to-alt", "ETH", "알트코인", chain),
      visualEdge("alt-to-defi", "알트코인", "DeFi", chain),
      visualEdge("market-to-stable", "암호화폐 시장", "스테이블코인", stable),
      visualEdge("stable-to-chain", "스테이블코인", "거래소·체인", stable),
    ];

    return [...signalEdges, ...visualEdges].map((edge) => ({
      ...edge,
      animated: reducedMotion ? false : edge.animated,
    }));
  }, [reducedMotion, signals]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.45fr_0.55fr]">
      <div className="h-[520px] rounded-lg border border-line bg-panel lg:h-[600px]" aria-label="돈의 흐름 미니맵">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          minZoom={0.35}
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
          방향: {statusText[selected.direction]} · 강도: {selected.strength}/3 · 신뢰도: {selected.confidence}
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
