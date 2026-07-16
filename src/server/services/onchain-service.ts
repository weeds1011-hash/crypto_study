import { chainDefinitions, metricDefinitions } from "@/features/onchain/definitions";
import { buildOnchainInsight } from "@/features/onchain/insights";
import { cached } from "@/server/cache/memory-cache";
import { DefiLlamaOnchainProvider } from "@/server/providers/onchain/defillama-provider";
import type { ChainMetricSnapshot, DataResponseMeta } from "@/server/providers/types";

export interface ChainDataResult {
  metrics: ChainMetricSnapshot[];
  meta: DataResponseMeta;
}

export async function getChainMetrics(chainIds = chainDefinitions.map((chain) => chain.id)): Promise<ChainDataResult> {
  const provider = new DefiLlamaOnchainProvider();
  try {
    const result = await cached(`onchain:${chainIds.join(",")}`, "defillama-onchain", 1000 * 60 * 30, async () => provider.fetchChainMetrics(chainIds));
    return { metrics: result.data, meta: result.meta };
  } catch {
    return {
      metrics: buildMissingMetrics(chainIds),
      meta: { source: "defillama-onchain", fetchedAt: new Date().toISOString(), stale: false, requestStatus: "failed" },
    };
  }
}

export async function getChainInsight(chainId: string) {
  const result = await getChainMetrics([chainId]);
  return { insight: buildOnchainInsight(chainId, result.metrics), meta: result.meta, metrics: result.metrics };
}

function buildMissingMetrics(chainIds: string[]): ChainMetricSnapshot[] {
  const now = new Date().toISOString();
  return chainIds.flatMap((chainId) =>
    metricDefinitions.map((definition) => ({
      chainId,
      metricId: definition.id,
      value: null,
      unit: definition.unit,
      change24h: null,
      change7d: null,
      sourceId: "provider-fallback",
      dataStatus: "missing" as const,
      updatedAt: now,
      confidence: "low" as const,
    })),
  );
}
