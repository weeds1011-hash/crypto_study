import type { MetricDataStatus } from "@/types";

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  category: "macro" | "regulation" | "bitcoin" | "ethereum" | "stablecoin" | "defi" | "security";
  relatedMetricIds: string[];
  relatedLessonIds: string[];
  impactPath?: string[];
  summary?: string;
  dataStatus: MetricDataStatus;
}
