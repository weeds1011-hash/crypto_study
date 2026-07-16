import { describe, expect, it, vi, afterEach } from "vitest";
import type { MetricSnapshot } from "@/types";
import { calculateFlowSignals } from "@/features/flow-signals/engine";
import { __liveTestUtils, buildLiveDashboard } from "@/features/market-data/live";
import { mockMetrics } from "@/features/market-data/mock";

const now = new Date().toISOString();

function liveMetric(id: string, changes: Partial<Pick<MetricSnapshot, "change24h" | "change7d" | "change30d">>): MetricSnapshot {
  return {
    metricId: id,
    label: id,
    value: 100,
    unit: "%",
    change24h: changes.change24h ?? null,
    change7d: changes.change7d ?? null,
    change30d: changes.change30d ?? null,
    sourceId: "test-live",
    updatedAt: now,
    confidence: "high",
    isEstimated: false,
    dataStatus: "live",
    fieldStatus: {
      value: "live",
      change24h: changes.change24h == null ? "missing" : "live",
      change7d: changes.change7d == null ? "missing" : "live",
      change30d: changes.change30d == null ? "missing" : "live",
      series: "missing",
    },
    interpretation: "test",
    caution: "test",
    series: [],
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("live market data normalization", () => {
  it("keeps zero percent changes as valid values", () => {
    expect(__liveTestUtils.changePercent(100, 100)).toBe(0);
  });

  it("returns null when previous data is missing", () => {
    expect(__liveTestUtils.changePercent(100, null)).toBeNull();
  });

  it("does not mix live current values with mock change fields", () => {
    const base = __liveTestUtils.missingMetric({
      metricId: "crypto_market_cap",
      label: "암호화폐 전체 시가총액",
      unit: "T USD",
      interpretation: "test",
      caution: "test",
    });
    const [metric] = __liveTestUtils.updateMetric([base], "crypto_market_cap", {
      value: 2.5,
      sourceId: "coingecko-global",
      fieldStatus: { value: "live", change24h: "missing", change7d: "missing", change30d: "missing", series: "missing" },
    });

    expect(metric.value).toBe(2.5);
    expect(metric.change24h).toBeNull();
    expect(metric.change7d).toBeNull();
    expect(metric.change30d).toBeNull();
    expect(metric.series).toEqual([]);
    expect(metric.dataStatus).toBe("mixed");
  });

  it("marks the dashboard as mixed when every live API fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const dashboard = await buildLiveDashboard();

    expect(dashboard.mode).toBe("mixed");
    expect(dashboard.metrics.every((metric) => metric.dataStatus === "missing")).toBe(true);
    expect(dashboard.metrics.every((metric) => metric.value === null)).toBe(true);
  });

  it("keeps partially failed APIs as missing instead of mock fallback", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("coingecko")) {
        return Response.json({ data: { total_market_cap: { usd: 2_000_000_000_000 }, market_cap_percentage: { btc: 50 } } });
      }
      throw new Error("failed");
    });
    vi.stubGlobal("fetch", fetchMock);

    const dashboard = await buildLiveDashboard();
    const marketCap = dashboard.metrics.find((metric) => metric.metricId === "crypto_market_cap");
    const stablecoins = dashboard.metrics.find((metric) => metric.metricId === "stablecoin_supply");

    expect(dashboard.mode).toBe("mixed");
    expect(marketCap?.value).toBe(2);
    expect(marketCap?.change7d).toBeNull();
    expect(marketCap?.fieldStatus.change7d).toBe("missing");
    expect(stablecoins?.dataStatus).toBe("missing");
  });
});

describe("flow signal engine", () => {
  it("does not use mock metrics for signal calculation", () => {
    const signals = calculateFlowSignals(mockMetrics);
    expect(signals.every((signal) => signal.dataCoverage === 0)).toBe(true);
    expect(signals.every((signal) => signal.direction === "uncertain")).toBe(true);
  });

  it("classifies inflow with positive live weighted signals", () => {
    const [signal] = calculateFlowSignals([
      liveMetric("global_liquidity", { change30d: 4 }),
      liveMetric("fed_rate", { change30d: -1 }),
    ]);
    expect(signal.direction).toBe("inflow");
    expect(signal.confidence).toBe("high");
  });

  it("classifies outflow with negative live weighted signals", () => {
    const signal = calculateFlowSignals([
      liveMetric("crypto_market_cap", { change7d: -4 }),
      liveMetric("stablecoin_supply", { change30d: -3 }),
    ]).find((item) => item.id === "risk-to-crypto");
    expect(signal?.direction).toBe("outflow");
  });

  it("classifies neutral when live changes are zero", () => {
    const signal = calculateFlowSignals([
      liveMetric("crypto_market_cap", { change7d: 0 }),
      liveMetric("stablecoin_supply", { change30d: 0 }),
    ]).find((item) => item.id === "risk-to-crypto");
    expect(signal?.direction).toBe("neutral");
  });

  it("classifies uncertain when data is stale", () => {
    const stale = liveMetric("crypto_market_cap", { change7d: 4 });
    stale.updatedAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString();
    const signal = calculateFlowSignals([stale]).find((item) => item.id === "risk-to-crypto");
    expect(signal?.direction).toBe("uncertain");
    expect(signal?.confidence).toBe("low");
  });

  it("calculates lower confidence when coverage is partial", () => {
    const signal = calculateFlowSignals([liveMetric("crypto_market_cap", { change7d: 4 })]).find((item) => item.id === "risk-to-crypto");
    expect(signal?.dataCoverage).toBe(0.5);
    expect(signal?.confidence).toBe("medium");
  });
});
