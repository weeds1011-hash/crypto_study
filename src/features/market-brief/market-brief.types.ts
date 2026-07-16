import type { Confidence, FlowSignal, MetricDataStatus } from "@/types";

export interface BriefSignal {
  title: string;
  description: string;
  direction: "positive" | "negative" | "neutral" | "uncertain";
  metricIds: string[];
}

export interface RecommendedLesson {
  lessonId: string;
  title: string;
  reason: string;
}

export interface MarketBrief {
  headline: string;
  summary: string[];
  primarySignal?: BriefSignal;
  counterSignals: BriefSignal[];
  unknowns: string[];
  recommendedLessons: RecommendedLesson[];
  sourceMetricIds: string[];
  generatedAt: string;
  generationMode: "rule" | "ai-assisted";
  confidence: Confidence;
}

export interface MarketBriefInput {
  metrics: Array<{
    id: string;
    label: string;
    value: number | null;
    change24h: number | null;
    change7d: number | null;
    change30d: number | null;
    dataStatus: MetricDataStatus;
    updatedAt: string;
  }>;
  flowSignals: FlowSignal[];
  availableLessonIds: string[];
}
