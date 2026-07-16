import type { FlowSignal, MetricSnapshot } from "@/types";

const directionLabels = {
  inflow: "유입 가능성",
  outflow: "유출 압력",
  neutral: "중립",
  uncertain: "판단 보류",
};

export function summarizeMarket(signals: FlowSignal[]) {
  const available = signals.filter((signal) => signal.dataCoverage >= 0.5);
  if (available.length === 0) {
    return {
      status: "판단 보류",
      text:
        "현재는 돈의 흐름을 판단하기에 충분한 실데이터가 부족합니다. 데이터 상태가 샘플 또는 없음인 지표가 많다면 방향을 단정하지 않고, 먼저 지표의 의미를 공부하는 편이 좋습니다.",
    };
  }

  const inflow = available.filter((signal) => signal.direction === "inflow");
  const outflow = available.filter((signal) => signal.direction === "outflow");
  const uncertain = signals.filter((signal) => signal.direction === "uncertain");
  const strongest = [...available].sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0];

  if (inflow.length > outflow.length) {
    return {
      status: "유입 신호 우세",
      text: `${strongest.sourceNode}에서 ${strongest.targetNode}로 ${directionLabels[strongest.direction]}이 관찰됩니다. 다만 ${uncertain.length}개 흐름은 데이터가 부족하거나 신호가 엇갈려 추가 확인이 필요합니다.`,
    };
  }

  if (outflow.length > inflow.length) {
    return {
      status: "유출 압력 우세",
      text: `${strongest.sourceNode}에서 ${strongest.targetNode} 구간에 ${directionLabels[strongest.direction]}이 나타납니다. 반대 신호와 데이터 확보율을 함께 봐야 하며, 단일 지표만으로 방향을 확정하지 않습니다.`,
    };
  }

  return {
    status: "혼조",
    text:
      "현재는 유입과 유출 신호가 뚜렷하게 한쪽으로 모이지 않습니다. 시장 카드의 변화율, 데이터 상태, 반대 신호를 함께 보며 판단을 보류하는 구간입니다.",
  };
}

export function pickStudyRecommendation(metrics: MetricSnapshot[], signals: FlowSignal[]) {
  const byId = new Map(metrics.map((metric) => [metric.metricId, metric]));
  const stablecoin = byId.get("stablecoin_supply");
  const tvl = byId.get("defi_tvl");
  const dominance = byId.get("btc_dominance");
  const cryptoFlow = signals.find((signal) => signal.id === "risk-to-crypto");

  if (stablecoin?.dataStatus === "live" || stablecoin?.dataStatus === "mock") {
    return {
      slug: "stablecoins",
      title: "스테이블코인이 시장에서 중요한 이유는?",
      reason: "시장 안의 대기 자금을 이해하면 돈이 실제로 이동하는 경로를 읽기 쉬워집니다.",
    };
  }

  if (tvl?.dataStatus === "live" || tvl?.dataStatus === "mock") {
    return {
      slug: "tvl",
      title: "TVL이 늘면 정말 좋은 신호일까?",
      reason: "DeFi TVL은 사용 수요와 가격 효과가 섞일 수 있어 해석 연습에 좋습니다.",
    };
  }

  if (dominance?.dataStatus === "live" || dominance?.dataStatus === "mock") {
    return {
      slug: "what-is-crypto",
      title: "비트코인 도미넌스가 오르면 무슨 뜻일까?",
      reason: "비트코인과 알트코인 사이의 관심 이동을 이해하는 첫 단서입니다.",
    };
  }

  return {
    slug: cryptoFlow?.direction === "uncertain" ? "what-is-money" : "what-is-crypto",
    title: "오늘은 암호화폐의 기본 구조부터 잡아볼까?",
    reason: "데이터가 부족할수록 먼저 자산의 목적과 돈의 기능을 구분하는 공부가 도움이 됩니다.",
  };
}

export function metricById(metrics: MetricSnapshot[], id: string) {
  return metrics.find((metric) => metric.metricId === id);
}
