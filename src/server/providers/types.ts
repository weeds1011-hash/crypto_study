import type { Confidence, MetricDataStatus } from "@/types";

export interface DataResponseMeta {
  source: string;
  fetchedAt: string;
  cachedAt?: string;
  stale: boolean;
  requestStatus: "success" | "partial" | "failed";
}

export interface ProviderError {
  provider: string;
  code: string;
  message: string;
  retryable: boolean;
  occurredAt: string;
}

export type NewsCategory = "macro" | "regulation" | "bitcoin" | "ethereum" | "stablecoin" | "defi" | "security" | "exchange";

export interface NormalizedNewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  articleUrl: string;
  publishedAt: string;
  category: NewsCategory;
  summary?: string;
  relatedMetricIds: string[];
  relatedLessonIds: string[];
  impactPath: string[];
  dataStatus: MetricDataStatus;
}

export interface NewsProvider {
  fetchLatestNews(params: { categories?: string[]; limit?: number }): Promise<NormalizedNewsItem[]>;
}

export interface NewsImpactLink {
  newsId: string;
  impactPath: string[];
  relatedMetricIds: string[];
  explanation: string;
  confidence: Confidence;
  relationType: "direct" | "indirect" | "contextual";
}

export interface ChainMetricSnapshot {
  chainId: string;
  metricId: string;
  value: number | null;
  unit: string;
  change24h: number | null;
  change7d: number | null;
  sourceId: string;
  dataStatus: MetricDataStatus;
  updatedAt: string;
  confidence: Confidence;
}

export interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  unit: string;
  calculationMethod?: string;
  caveats: string[];
}

export interface OnchainProvider {
  fetchChainMetrics(chainIds: string[]): Promise<ChainMetricSnapshot[]>;
}
