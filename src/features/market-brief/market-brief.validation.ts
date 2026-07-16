import type { MarketBrief } from "./market-brief.types";

const directions = new Set(["positive", "negative", "neutral", "uncertain"]);
const confidences = new Set(["high", "medium", "low"]);

export function validateMarketBrief(value: unknown): value is MarketBrief {
  if (!value || typeof value !== "object") return false;
  const brief = value as Partial<MarketBrief>;
  if (typeof brief.headline !== "string") return false;
  if (!Array.isArray(brief.summary) || brief.summary.some((item) => typeof item !== "string")) return false;
  if (!Array.isArray(brief.counterSignals)) return false;
  if (!Array.isArray(brief.unknowns)) return false;
  if (!Array.isArray(brief.recommendedLessons)) return false;
  if (!Array.isArray(brief.sourceMetricIds)) return false;
  if (brief.generationMode !== "rule" && brief.generationMode !== "ai-assisted") return false;
  if (!confidences.has(String(brief.confidence))) return false;
  if (brief.primarySignal && !directions.has(brief.primarySignal.direction)) return false;
  return true;
}
