import type { RetrievedContext } from "./retrieval";

export interface MentorDiagram {
  title: string;
  mermaid: string;
}

export function buildFlowDiagram(context: RetrievedContext): MentorDiagram {
  const hasMacro = context.metrics.some((metric) => metric.metricId === "fed_rate" || metric.metricId === "global_liquidity");
  const hasBtc = context.coins.some((coin) => coin.symbol === "btc") || context.metrics.some((metric) => metric.metricId === "btc_dominance");
  const hasDefi = context.metrics.some((metric) => metric.metricId === "defi_tvl");
  const nodes = ["Fed[연준·금리]", "Dollar[달러·유동성]", "BTC[BTC]", "ETH[ETH]", "Alt[알트코인]", "DeFi[DeFi]"];
  const lines = [
    "flowchart LR",
    ...nodes,
    `Fed -->|${hasMacro ? "앱 지표 연결" : "구조 설명"}| Dollar`,
    `Dollar -->|위험자산 심리| BTC`,
    `BTC -->|${hasBtc ? "도미넌스 확인" : "시장 기준 자산"}| ETH`,
    "ETH -->|스마트 계약 생태계| Alt",
    `Alt -->|${hasDefi ? "TVL 확인" : "온체인 활동"}| DeFi`,
  ];
  return {
    title: "돈의 흐름 다이어그램",
    mermaid: lines.join("\n"),
  };
}
