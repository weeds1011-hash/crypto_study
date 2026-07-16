import type { Confidence, DataFieldKey, MarketDashboardPayload, MetricDataStatus, MetricSnapshot, TimeSeriesPoint } from "@/types";
import { calculateFlowSignals } from "@/features/flow-signals/engine";

const CACHE_SECONDS = 60 * 10;
const FIELD_KEYS: DataFieldKey[] = ["value", "change24h", "change7d", "change30d", "series"];

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: CACHE_SECONDS },
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}`);
  }

  return (await response.json()) as T;
}

type CoinGeckoGlobal = {
  data?: {
    total_market_cap?: { usd?: number };
    market_cap_percentage?: { btc?: number; eth?: number };
    total_volume?: { usd?: number };
  };
};

type DefiLlamaStablecoins = {
  totalCirculatingUSD?: {
    peggedUSD?: number;
  };
};

type DefiLlamaTvl = Array<{
  date: number;
  totalLiquidityUSD: number;
}>;

type MetricInput = Pick<MetricSnapshot, "metricId" | "label" | "unit" | "learnSlug"> & {
  interpretation: string;
  caution: string;
};

const metricDefinitions: MetricInput[] = [
  {
    metricId: "global_liquidity",
    label: "세계 유동성",
    unit: "index",
    learnSlug: "what-is-money",
    interpretation: "아직 실제 API가 연결되지 않은 지표입니다.",
    caution: "실시간 모드에서는 샘플 값으로 숨겨 표시하지 않고 데이터 없음으로 표시합니다.",
  },
  {
    metricId: "fed_rate",
    label: "달러 금리",
    unit: "%",
    learnSlug: "what-is-money",
    interpretation: "아직 실제 FRED API가 연결되지 않은 지표입니다.",
    caution: "금리 변화율이 없으면 돈의 흐름 엔진 계산에서 제외합니다.",
  },
  {
    metricId: "crypto_market_cap",
    label: "암호화폐 전체 시가총액",
    unit: "T USD",
    learnSlug: "what-is-crypto",
    interpretation: "CoinGecko 기준 전체 암호화폐 시가총액입니다.",
    caution: "현재값만 연결된 경우 변화율과 차트는 데이터 없음으로 표시합니다.",
  },
  {
    metricId: "btc_dominance",
    label: "비트코인 도미넌스",
    unit: "%",
    learnSlug: "what-is-crypto",
    interpretation: "CoinGecko 기준 비트코인의 시장 비중입니다.",
    caution: "도미넌스만으로 알트코인 매수세를 단정하지 마세요.",
  },
  {
    metricId: "stablecoin_supply",
    label: "스테이블코인 공급량",
    unit: "B USD",
    learnSlug: "stablecoins",
    interpretation: "DeFiLlama 기준 스테이블코인 총 유통 규모입니다.",
    caution: "현재값만 연결된 경우 공급 변화율은 데이터 없음으로 표시합니다.",
  },
  {
    metricId: "defi_tvl",
    label: "DeFi TVL",
    unit: "B USD",
    learnSlug: "tvl",
    interpretation: "DeFiLlama 기준 전체 체인 TVL입니다.",
    caution: "TVL은 자산 가격 상승만으로도 증가할 수 있습니다.",
  },
];

function fieldStatus(status: MetricDataStatus) {
  return FIELD_KEYS.reduce(
    (acc, key) => ({ ...acc, [key]: status }),
    {} as Record<DataFieldKey, MetricDataStatus>,
  );
}

function missingMetric(definition: MetricInput): MetricSnapshot {
  return {
    ...definition,
    value: null,
    change24h: null,
    change7d: null,
    change30d: null,
    sourceId: "not-connected",
    updatedAt: new Date().toISOString(),
    confidence: "low",
    isEstimated: false,
    dataStatus: "missing",
    fieldStatus: fieldStatus("missing"),
    series: [],
  };
}

function statusFromFields(statuses: MetricDataStatus[]): MetricDataStatus {
  if (statuses.every((status) => status === "live")) return "live";
  if (statuses.every((status) => status === "mock")) return "mock";
  if (statuses.every((status) => status === "missing")) return "missing";
  return "mixed";
}

function confidenceFromFields(metric: MetricSnapshot): Confidence {
  const statuses = Object.values(metric.fieldStatus);
  const liveRatio = statuses.filter((status) => status === "live").length / statuses.length;
  const ageMs = Date.now() - new Date(metric.updatedAt).getTime();
  const fresh = Number.isFinite(ageMs) && ageMs <= CACHE_SECONDS * 1000 * 2;

  if (metric.dataStatus === "missing" || liveRatio === 0) return "low";
  if (liveRatio >= 0.8 && fresh) return "high";
  if (liveRatio >= 0.4 && fresh) return "medium";
  return "low";
}

function updateMetric(metrics: MetricSnapshot[], metricId: string, patch: Partial<MetricSnapshot>) {
  return metrics.map((metric) => {
    if (metric.metricId !== metricId) return metric;

    const nextFieldStatus = {
      ...metric.fieldStatus,
      ...patch.fieldStatus,
    };
    const dataStatus = patch.dataStatus ?? statusFromFields(Object.values(nextFieldStatus));
    const next: MetricSnapshot = {
      ...metric,
      ...patch,
      fieldStatus: nextFieldStatus,
      dataStatus,
      isEstimated: dataStatus === "mock" || dataStatus === "mixed",
      updatedAt: patch.updatedAt ?? new Date().toISOString(),
    };

    return {
      ...next,
      confidence: patch.confidence ?? confidenceFromFields(next),
    };
  });
}

function changePercent(current: number, previous: number | null): number | null {
  if (previous == null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function tvlSeries(points: DefiLlamaTvl): TimeSeriesPoint[] {
  return points.slice(-30).map((point) => ({
    timestamp: new Date(point.date * 1000).toLocaleDateString("ko-KR", { month: "short", day: "numeric" }),
    value: point.totalLiquidityUSD / 1_000_000_000,
  }));
}

function dashboardMode(metrics: MetricSnapshot[]): MarketDashboardPayload["mode"] {
  const statuses = metrics.map((metric) => metric.dataStatus);
  if (statuses.every((status) => status === "mock")) return "mock";
  if (statuses.every((status) => status === "live")) return "live";
  return "mixed";
}

export async function buildLiveDashboard(): Promise<MarketDashboardPayload> {
  const warnings: string[] = [];
  let metrics = metricDefinitions.map(missingMetric);

  try {
    const global = await fetchJson<CoinGeckoGlobal>("https://api.coingecko.com/api/v3/global");
    const capUsd = global.data?.total_market_cap?.usd;
    const btcDominance = global.data?.market_cap_percentage?.btc;

    if (capUsd != null) {
      metrics = updateMetric(metrics, "crypto_market_cap", {
        value: capUsd / 1_000_000_000_000,
        sourceId: "coingecko-global",
        fieldStatus: { value: "live", change24h: "missing", change7d: "missing", change30d: "missing", series: "missing" },
      });
    }

    if (btcDominance != null) {
      metrics = updateMetric(metrics, "btc_dominance", {
        value: btcDominance,
        sourceId: "coingecko-global",
        fieldStatus: { value: "live", change24h: "missing", change7d: "missing", change30d: "missing", series: "missing" },
      });
    }
  } catch {
    warnings.push("CoinGecko 데이터를 불러오지 못해 해당 지표는 데이터 없음으로 표시합니다.");
  }

  try {
    const stablecoins = await fetchJson<DefiLlamaStablecoins>("https://stablecoins.llama.fi/stablecoins?includePrices=true");
    const stablecoinSupply = stablecoins.totalCirculatingUSD?.peggedUSD;

    if (stablecoinSupply != null) {
      metrics = updateMetric(metrics, "stablecoin_supply", {
        value: stablecoinSupply / 1_000_000_000,
        sourceId: "defillama-stablecoins",
        fieldStatus: { value: "live", change24h: "missing", change7d: "missing", change30d: "missing", series: "missing" },
      });
    }
  } catch {
    warnings.push("DeFiLlama 스테이블코인 데이터를 불러오지 못해 해당 지표는 데이터 없음으로 표시합니다.");
  }

  try {
    const tvl = await fetchJson<DefiLlamaTvl>("https://api.llama.fi/v2/historicalChainTvl");
    const latestPoint = tvl.at(-1);
    const latest = latestPoint?.totalLiquidityUSD;

    if (latest != null) {
      const current = latest / 1_000_000_000;
      const previous1 = tvl.at(-2)?.totalLiquidityUSD ?? null;
      const previous7 = tvl.at(-8)?.totalLiquidityUSD ?? null;
      const previous30 = tvl.at(-31)?.totalLiquidityUSD ?? null;

      metrics = updateMetric(metrics, "defi_tvl", {
        value: current,
        change24h: changePercent(latest, previous1),
        change7d: changePercent(latest, previous7),
        change30d: changePercent(latest, previous30),
        sourceId: "defillama-tvl",
        series: tvlSeries(tvl),
        fieldStatus: {
          value: "live",
          change24h: previous1 != null ? "live" : "missing",
          change7d: previous7 != null ? "live" : "missing",
          change30d: previous30 != null ? "live" : "missing",
          series: tvl.length > 0 ? "live" : "missing",
        },
        updatedAt: latestPoint?.date != null ? new Date(latestPoint.date * 1000).toISOString() : new Date().toISOString(),
      });
    }
  } catch {
    warnings.push("DeFiLlama TVL 데이터를 불러오지 못해 해당 지표는 데이터 없음으로 표시합니다.");
  }

  const mode = dashboardMode(metrics);

  return {
    mode,
    updatedAt: new Date().toISOString(),
    summary:
      "실시간 모드에서는 실제로 확보한 필드만 표시합니다. 변화율이 없거나 API가 실패한 지표는 데이터 없음으로 두며, 돈의 흐름 엔진 계산에서도 제외합니다.",
    metrics,
    flowSignals: calculateFlowSignals(metrics),
    dataWarnings: warnings,
  };
}

export const __liveTestUtils = {
  changePercent,
  dashboardMode,
  missingMetric,
  updateMetric,
};
