import type { FlowSignal, MetricSnapshot } from "@/types";
import type { Lesson } from "@/types";
import { buildRuleMarketBrief } from "./market-brief.rules";
import { validateMarketBrief } from "./market-brief.validation";

export async function getMarketBrief(metrics: MetricSnapshot[], flowSignals: FlowSignal[], lessons: Lesson[]) {
  const ruleBrief = buildRuleMarketBrief(metrics, flowSignals, lessons);

  if (process.env.AI_BRIEF_ENABLED !== "true") {
    return {
      ...ruleBrief,
      unknowns: [...ruleBrief.unknowns, "AI 해설은 비활성화되어 규칙 기반 요약을 표시합니다."],
    };
  }

  // AI provider integration is intentionally disabled until server-side API keys are configured.
  const aiResult: unknown = null;
  if (validateMarketBrief(aiResult)) {
    return aiResult;
  }

  return {
    ...ruleBrief,
    unknowns: [...ruleBrief.unknowns, "AI 해설 검증에 실패해 규칙 기반 요약을 표시합니다."],
  };
}
