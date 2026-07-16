import { chainDefinitions, metricDefinitions } from "@/features/onchain/definitions";
import type { ChainMetricSnapshot, OnchainProvider } from "@/server/providers/types";

type LlamaChain = { name: string; tvl?: number };
type StablecoinChain = { name: string; circulating?: { peggedUSD?: number } };

const chainNameMap: Record<string, string[]> = {
  bitcoin: ["Bitcoin"],
  ethereum: ["Ethereum"],
  solana: ["Solana"],
};

export class DefiLlamaOnchainProvider implements OnchainProvider {
  async fetchChainMetrics(chainIds: string[]) {
    const now = new Date().toISOString();
    const base = createMissingMetrics(chainIds, now);
    const [tvlResult, stablecoinResult] = await Promise.allSettled([fetchTvl(), fetchStablecoins()]);
    const tvl = tvlResult.status === "fulfilled" ? tvlResult.value : [];
    const stablecoins = stablecoinResult.status === "fulfilled" ? stablecoinResult.value : [];

    return base.map((metric) => {
      if (metric.metricId === "tvl") {
        const value = findByChain(tvl, metric.chainId)?.tvl;
        return value != null ? liveMetric(metric, value / 1_000_000_000, "defillama-chains") : metric;
      }
      if (metric.metricId === "stablecoin_supply") {
        const value = findByChain(stablecoins, metric.chainId)?.circulating?.peggedUSD;
        return value != null ? liveMetric(metric, value / 1_000_000_000, "defillama-stablecoins") : metric;
      }
      return metric;
    });
  }
}

function createMissingMetrics(chainIds: string[], now: string): ChainMetricSnapshot[] {
  const supported = chainIds.filter((chainId) => chainDefinitions.some((chain) => chain.id === chainId));
  return supported.flatMap((chainId) =>
    metricDefinitions.map((definition) => ({
      chainId,
      metricId: definition.id,
      value: null,
      unit: definition.unit,
      change24h: null,
      change7d: null,
      sourceId: "provider-not-connected",
      dataStatus: "missing" as const,
      updatedAt: now,
      confidence: "low" as const,
    })),
  );
}

function liveMetric(metric: ChainMetricSnapshot, value: number, sourceId: string): ChainMetricSnapshot {
  return {
    ...metric,
    value: Number(value.toFixed(3)),
    sourceId,
    dataStatus: "live",
    confidence: "medium",
    updatedAt: new Date().toISOString(),
  };
}

async function fetchTvl(): Promise<LlamaChain[]> {
  const response = await fetch("https://api.llama.fi/v2/chains", { next: { revalidate: 1800 } });
  if (!response.ok) throw new Error("DefiLlama chains failed");
  return response.json() as Promise<LlamaChain[]>;
}

async function fetchStablecoins(): Promise<StablecoinChain[]> {
  const response = await fetch("https://stablecoins.llama.fi/stablecoins?includePrices=true", { next: { revalidate: 1800 } });
  if (!response.ok) throw new Error("DefiLlama stablecoins failed");
  const payload = (await response.json()) as { chains?: StablecoinChain[] };
  return payload.chains ?? [];
}

function findByChain<T extends { name: string }>(items: T[], chainId: string) {
  const names = chainNameMap[chainId] ?? [];
  return items.find((item) => names.some((name) => item.name.toLowerCase() === name.toLowerCase()));
}
