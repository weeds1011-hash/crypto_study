import type { Confidence, FlowSignal, MetricSnapshot, SignalReason } from "@/types";

const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 2;

type MetricRule = {
  metricId: string;
  changeKey: "change24h" | "change7d" | "change30d";
  weight: number;
  positiveMeans: "inflow" | "outflow";
  label: string;
};

type SignalRule = {
  id: string;
  sourceNode: string;
  targetNode: string;
  rules: MetricRule[];
};

const signalRules: SignalRule[] = [
  {
    id: "macro-to-risk-assets",
    sourceNode: "거시경제",
    targetNode: "위험자산",
    rules: [
      { metricId: "global_liquidity", changeKey: "change30d", weight: 1.2, positiveMeans: "inflow", label: "세계 유동성" },
      { metricId: "fed_rate", changeKey: "change30d", weight: 1.1, positiveMeans: "outflow", label: "달러 금리" },
    ],
  },
  {
    id: "risk-to-crypto",
    sourceNode: "위험자산",
    targetNode: "암호화폐 시장",
    rules: [
      { metricId: "crypto_market_cap", changeKey: "change7d", weight: 1.2, positiveMeans: "inflow", label: "암호화폐 전체 시가총액" },
      { metricId: "stablecoin_supply", changeKey: "change30d", weight: 0.9, positiveMeans: "inflow", label: "스테이블코인 공급량" },
    ],
  },
  {
    id: "stablecoins-to-crypto",
    sourceNode: "스테이블코인",
    targetNode: "암호화폐 시장",
    rules: [
      { metricId: "stablecoin_supply", changeKey: "change7d", weight: 1.0, positiveMeans: "inflow", label: "스테이블코인 공급량" },
      { metricId: "stablecoin_supply", changeKey: "change30d", weight: 0.8, positiveMeans: "inflow", label: "스테이블코인 공급량" },
    ],
  },
  {
    id: "crypto-to-exchange-chain",
    sourceNode: "암호화폐 시장",
    targetNode: "거래소·체인",
    rules: [
      { metricId: "crypto_market_cap", changeKey: "change24h", weight: 0.9, positiveMeans: "inflow", label: "암호화폐 전체 시가총액" },
      { metricId: "defi_tvl", changeKey: "change24h", weight: 1.0, positiveMeans: "inflow", label: "DeFi TVL" },
    ],
  },
  {
    id: "exchange-chain-to-alts",
    sourceNode: "거래소·체인",
    targetNode: "알트코인·DeFi",
    rules: [
      { metricId: "defi_tvl", changeKey: "change7d", weight: 1.2, positiveMeans: "inflow", label: "DeFi TVL" },
      { metricId: "btc_dominance", changeKey: "change7d", weight: 1.0, positiveMeans: "outflow", label: "비트코인 도미넌스" },
    ],
  },
  {
    id: "crypto-to-alts",
    sourceNode: "암호화폐 시장",
    targetNode: "알트코인·DeFi",
    rules: [
      { metricId: "btc_dominance", changeKey: "change30d", weight: 1.0, positiveMeans: "outflow", label: "비트코인 도미넌스" },
      { metricId: "defi_tvl", changeKey: "change30d", weight: 1.2, positiveMeans: "inflow", label: "DeFi TVL" },
    ],
  },
];

function findMetric(metrics: MetricSnapshot[], id: string) {
  return metrics.find((item) => item.metricId === id);
}

function isFresh(metric: MetricSnapshot, now: number) {
  const updatedAt = new Date(metric.updatedAt).getTime();
  return Number.isFinite(updatedAt) && now - updatedAt <= MAX_AGE_MS;
}

function confidenceWeight(confidence: Confidence) {
  if (confidence === "high") return 1;
  if (confidence === "medium") return 0.7;
  return 0.45;
}

function metricUsable(metric: MetricSnapshot | undefined, changeKey: MetricRule["changeKey"], now: number) {
  if (!metric) return false;
  if (metric.dataStatus !== "live") return false;
  if (metric.fieldStatus[changeKey] !== "live") return false;
  if (metric[changeKey] == null) return false;
  return isFresh(metric, now);
}

function contribution(change: number, rule: MetricRule, metric: MetricSnapshot) {
  const magnitude = Math.min(Math.abs(change) / 5, 1.5);
  const directionSign = change > 0 ? 1 : change < 0 ? -1 : 0;
  const inflowSign = rule.positiveMeans === "inflow" ? directionSign : -directionSign;
  return inflowSign * magnitude * rule.weight * confidenceWeight(metric.confidence);
}

function reasonFor(metric: MetricSnapshot, rule: MetricRule, score: number): SignalReason {
  const change = metric[rule.changeKey];
  const direction = score > 0 ? "유입" : score < 0 ? "유출" : "중립";
  return {
    metricId: metric.metricId,
    label: metric.label,
    score,
    explanation: `${rule.label} ${rule.changeKey} 변화율 ${change?.toFixed(2)}%가 ${direction} 점수에 반영됐습니다.`,
  };
}

function directionFrom(score: number, coverage: number, agreement: number): FlowSignal["direction"] {
  if (coverage < 0.5) return "uncertain";
  if (Math.abs(score) < 0.15) return "neutral";
  if (agreement < 0.45) return "uncertain";
  if (score >= 0.15) return "inflow";
  if (score <= -0.15) return "outflow";
  return "neutral";
}

function strengthFrom(score: number): 0 | 1 | 2 | 3 {
  const absolute = Math.abs(score);
  if (absolute >= 1.2) return 3;
  if (absolute >= 0.65) return 2;
  if (absolute >= 0.15) return 1;
  return 0;
}

function confidenceFrom(coverage: number, liveRatio: number, agreement: number): Confidence {
  const score = coverage * 0.45 + liveRatio * 0.35 + agreement * 0.2;
  if (score >= 0.8) return "high";
  if (score >= 0.55) return "medium";
  return "low";
}

function buildSignal(ruleSet: SignalRule, metrics: MetricSnapshot[], now: number): FlowSignal {
  const usable = ruleSet.rules
    .map((rule) => {
      const metric = findMetric(metrics, rule.metricId);
      if (!metricUsable(metric, rule.changeKey, now) || !metric) return null;
      const change = metric[rule.changeKey];
      if (change == null) return null;
      const score = contribution(change, rule, metric);
      return { metric, rule, score };
    })
    .filter((item): item is { metric: MetricSnapshot; rule: MetricRule; score: number } => item != null);

  const rawScore = usable.reduce((sum, item) => sum + item.score, 0);
  const weightSum = usable.reduce((sum, item) => sum + item.rule.weight, 0);
  const normalizedScore = weightSum > 0 ? rawScore / weightSum : 0;
  const dataCoverage = usable.length / ruleSet.rules.length;
  const liveMetricRatio = usable.length / ruleSet.rules.length;
  const positiveCount = usable.filter((item) => item.score > 0).length;
  const negativeCount = usable.filter((item) => item.score < 0).length;
  const agreement = usable.length === 0 ? 0 : Math.max(positiveCount, negativeCount, usable.length - positiveCount - negativeCount) / usable.length;
  const direction = directionFrom(normalizedScore, dataCoverage, agreement);

  return {
    id: ruleSet.id,
    sourceNode: ruleSet.sourceNode,
    targetNode: ruleSet.targetNode,
    direction,
    strength: strengthFrom(normalizedScore),
    confidence: confidenceFrom(dataCoverage, liveMetricRatio, agreement),
    score: Number(normalizedScore.toFixed(4)),
    dataCoverage: Number(dataCoverage.toFixed(4)),
    liveMetricRatio: Number(liveMetricRatio.toFixed(4)),
    reasons: usable.filter((item) => item.score >= 0).map((item) => reasonFor(item.metric, item.rule, item.score)),
    counterSignals: usable.filter((item) => item.score < 0).map((item) => reasonFor(item.metric, item.rule, item.score)),
    updatedAt: new Date(now).toISOString(),
  };
}

export function calculateFlowSignals(metrics: MetricSnapshot[]): FlowSignal[] {
  const now = Date.now();
  return signalRules.map((ruleSet) => buildSignal(ruleSet, metrics, now));
}

export const __flowTestUtils = {
  confidenceFrom,
  directionFrom,
  metricUsable,
};
