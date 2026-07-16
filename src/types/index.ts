export type Confidence = "high" | "medium" | "low";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type DataMode = "mock" | "mixed" | "live";
export type MetricDataStatus = "live" | "mock" | "mixed" | "missing";
export type DataFieldKey = "value" | "change24h" | "change7d" | "change30d" | "series";

export interface TimeSeriesPoint {
  timestamp: string;
  value: number | null;
}

export interface MetricSnapshot {
  metricId: string;
  label: string;
  value: number | null;
  unit: string;
  change24h?: number | null;
  change7d?: number | null;
  change30d?: number | null;
  sourceId: string;
  updatedAt: string;
  confidence: Confidence;
  isEstimated: boolean;
  dataStatus: MetricDataStatus;
  fieldStatus: Record<DataFieldKey, MetricDataStatus>;
  interpretation: string;
  caution: string;
  learnSlug?: string;
  series: TimeSeriesPoint[];
}

export interface LessonExample {
  title: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  summary: string;
  simpleExplanation: string;
  analogy: string;
  detailedExplanation: string;
  whyItMatters: string;
  examples: LessonExample[];
  misconceptions: string[];
  risks: string[];
  relatedTerms: string[];
  relatedMetricIds: string[];
  prerequisites: string[];
  nextLessons: string[];
  quiz: QuizQuestion[];
  difficulty: Difficulty;
  estimatedMinutes: number;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  englishTerm?: string;
  oneLineDefinition: string;
  simpleExplanation: string;
  detailedExplanation: string;
  example?: string;
  relatedTerms: string[];
  category: string;
  difficulty: Difficulty;
}

export interface SignalReason {
  metricId: string;
  label: string;
  explanation: string;
  score?: number;
}

export interface FlowSignal {
  id: string;
  sourceNode: string;
  targetNode: string;
  direction: "inflow" | "outflow" | "neutral" | "uncertain";
  strength: 0 | 1 | 2 | 3;
  confidence: Confidence;
  score: number;
  dataCoverage: number;
  liveMetricRatio: number;
  reasons: SignalReason[];
  counterSignals: SignalReason[];
  updatedAt: string;
}

export interface MarketDashboardPayload {
  mode: DataMode;
  updatedAt: string;
  summary: string;
  metrics: MetricSnapshot[];
  flowSignals: FlowSignal[];
  dataWarnings: string[];
}
