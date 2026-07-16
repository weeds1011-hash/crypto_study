import type { ChainMetricSnapshot } from "@/server/providers/types";
import type { Confidence } from "@/types";

export interface InsightSignal {
  metricId: string;
  label: string;
  explanation: string;
}

export interface OnchainInsight {
  title: string;
  summary: string;
  positiveSignals: InsightSignal[];
  negativeSignals: InsightSignal[];
  neutralSignals: InsightSignal[];
  unknowns: string[];
  metricIds: string[];
  confidence: Confidence;
}

const labels: Record<string, string> = {
  active_addresses: "활성 주소",
  transaction_count: "거래 수",
  average_fee: "평균 수수료",
  exchange_inflow: "거래소 유입",
  exchange_outflow: "거래소 유출",
  stablecoin_supply: "스테이블코인 공급",
  dex_volume: "DEX 거래량",
  tvl: "TVL",
  bridge_net_inflow: "브리지 순유입",
};

export function buildOnchainInsight(chainId: string, metrics: ChainMetricSnapshot[]): OnchainInsight {
  const liveMetrics = metrics.filter((metric) => metric.dataStatus === "live");
  const positiveSignals: InsightSignal[] = [];
  const negativeSignals: InsightSignal[] = [];
  const neutralSignals: InsightSignal[] = [];
  const unknowns = metrics
    .filter((metric) => metric.dataStatus === "missing" || metric.value == null)
    .map((metric) => `${labels[metric.metricId] ?? metric.metricId} 지표는 아직 연결된 공급자가 없거나 실패했습니다.`);

  for (const metric of liveMetrics) {
    const label = labels[metric.metricId] ?? metric.metricId;
    if (metric.metricId === "tvl" || metric.metricId === "stablecoin_supply") {
      positiveSignals.push({
        metricId: metric.metricId,
        label,
        explanation: `${label} 데이터가 확인됩니다. 다만 자산 가격 변화나 공급자 집계 기준이 포함될 수 있습니다.`,
      });
    } else if (metric.change7d != null && metric.change7d < 0) {
      negativeSignals.push({
        metricId: metric.metricId,
        label,
        explanation: `${label}의 7일 변화가 감소했지만 원인 판단에는 추가 데이터가 필요합니다.`,
      });
    } else {
      neutralSignals.push({
        metricId: metric.metricId,
        label,
        explanation: `${label}은 확인됐지만 방향 판단은 제한적입니다.`,
      });
    }
  }

  const coverage = metrics.length === 0 ? 0 : liveMetrics.length / metrics.length;
  return {
    title: `${chainId.toUpperCase()} 온체인 해설`,
    summary:
      liveMetrics.length > 0
        ? "일부 온체인 지표가 연결되어 있습니다. 지표 정의와 한계를 함께 보며 해석해야 합니다."
        : "현재 연결 가능한 온체인 데이터가 부족해 판단을 보류합니다.",
    positiveSignals,
    negativeSignals,
    neutralSignals,
    unknowns,
    metricIds: metrics.map((metric) => metric.metricId),
    confidence: coverage >= 0.6 ? "high" : coverage >= 0.25 ? "medium" : "low",
  };
}
