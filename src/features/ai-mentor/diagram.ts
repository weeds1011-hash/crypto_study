import type { RetrievedContext } from "./retrieval";

export interface MentorDiagram {
  title: string;
  mermaid: string;
  nodes: Array<{ id: string; label: string }>;
  edges: Array<{ source: string; target: string; label: string }>;
  fallbackPath: string;
}

const allowedNodes = [
  { id: "Fed", label: "연준·금리" },
  { id: "Dollar", label: "달러·유동성" },
  { id: "BTC", label: "BTC" },
  { id: "ETH", label: "ETH" },
  { id: "Alt", label: "알트코인" },
  { id: "DeFi", label: "DeFi" },
];

export function buildFlowDiagram(context: RetrievedContext): MentorDiagram {
  const hasMacro = context.metrics.some((metric) => metric.metricId === "fed_rate" || metric.metricId === "global_liquidity");
  const hasBtc = context.coins.some((coin) => coin.symbol === "btc") || context.metrics.some((metric) => metric.metricId === "btc_dominance");
  const hasDefi = context.metrics.some((metric) => metric.metricId === "defi_tvl");
  const edges = [
    { source: "Fed", target: "Dollar", label: hasMacro ? "앱 지표 연결" : "구조 설명" },
    { source: "Dollar", target: "BTC", label: "위험자산 심리" },
    { source: "BTC", target: "ETH", label: hasBtc ? "도미넌스 확인" : "시장 기준 자산" },
    { source: "ETH", target: "Alt", label: "스마트 계약 생태계" },
    { source: "Alt", target: "DeFi", label: hasDefi ? "TVL 확인" : "온체인 활동" },
  ];
  const lines = [
    "flowchart LR",
    ...allowedNodes.map((node) => `${node.id}[${node.label}]`),
    ...edges.map((edge) => `${edge.source} -->|${edge.label}| ${edge.target}`),
  ];
  return {
    title: "돈의 흐름 다이어그램",
    mermaid: lines.join("\n"),
    nodes: allowedNodes,
    edges,
    fallbackPath: allowedNodes.map((node) => node.label).join(" -> "),
  };
}

export function isAllowedDiagram(diagram: MentorDiagram) {
  const nodeIds = new Set(allowedNodes.map((node) => node.id));
  return diagram.nodes.every((node) => nodeIds.has(node.id)) && diagram.edges.every((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));
}
