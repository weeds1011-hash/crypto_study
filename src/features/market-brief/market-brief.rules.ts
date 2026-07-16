import type { FlowSignal, MetricSnapshot } from "@/types";
import type { Lesson } from "@/types";
import type { BriefSignal, MarketBrief } from "./market-brief.types";

function directionToBrief(direction: FlowSignal["direction"]): BriefSignal["direction"] {
  if (direction === "inflow") return "positive";
  if (direction === "outflow") return "negative";
  if (direction === "neutral") return "neutral";
  return "uncertain";
}

function metricIdsFrom(signal: FlowSignal) {
  return Array.from(new Set([...signal.reasons, ...signal.counterSignals].map((reason) => reason.metricId)));
}

function signalTitle(signal: FlowSignal) {
  return `${signal.sourceNode} → ${signal.targetNode}`;
}

export function buildRuleMarketBrief(metrics: MetricSnapshot[], flowSignals: FlowSignal[], lessons: Lesson[]): MarketBrief {
  const usableSignals = flowSignals.filter((signal) => signal.dataCoverage >= 0.5);
  const strongest = [...usableSignals].sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0];
  const unknowns = flowSignals
    .filter((signal) => signal.direction === "uncertain" || signal.dataCoverage < 0.5)
    .map((signal) => `${signalTitle(signal)} 구간은 데이터 확보율이 ${(signal.dataCoverage * 100).toFixed(0)}%라 판단을 제한합니다.`);
  const liveRatio = metrics.length === 0 ? 0 : metrics.filter((metric) => metric.dataStatus === "live").length / metrics.length;
  const missingMetrics = metrics.filter((metric) => metric.dataStatus === "missing");
  const counterSignals = usableSignals
    .filter((signal) => signal.counterSignals.length > 0 || signal.direction === "outflow")
    .slice(0, 3)
    .map<BriefSignal>((signal) => ({
      title: signalTitle(signal),
      description:
        signal.counterSignals[0]?.explanation ??
        `${signal.sourceNode}에서 ${signal.targetNode} 방향으로 유출 압력이 관찰되지만 단정하지 않습니다.`,
      direction: directionToBrief(signal.direction),
      metricIds: metricIdsFrom(signal),
    }));

  const primarySignal = strongest
    ? {
        title: signalTitle(strongest),
        description:
          strongest.reasons[0]?.explanation ??
          `${strongest.sourceNode}에서 ${strongest.targetNode} 방향의 흐름을 관찰했지만 근거가 제한적입니다.`,
        direction: directionToBrief(strongest.direction),
        metricIds: metricIdsFrom(strongest),
      }
    : undefined;

  const recommendedLessons = lessons
    .filter((lesson) => lesson.relatedMetricIds.some((id) => metrics.some((metric) => metric.metricId === id && metric.dataStatus !== "missing")))
    .slice(0, 2)
    .map((lesson) => ({
      lessonId: lesson.slug,
      title: lesson.title,
      reason: `${lesson.relatedMetricIds.join(", ")} 지표와 연결해 볼 수 있는 수업입니다.`,
    }));

  const headline = primarySignal
    ? `${primarySignal.title} 흐름은 ${primarySignal.direction === "positive" ? "유입 쪽" : primarySignal.direction === "negative" ? "유출 쪽" : "중립 또는 보류"}으로 읽히지만 단정할 수 없습니다.`
    : "현재 데이터만으로 시장 흐름을 판단하기 어렵습니다.";

  const summary = [
    primarySignal?.description ?? "충분한 실데이터가 없어 규칙 기반 해설을 제한적으로 표시합니다.",
    counterSignals.length > 0
      ? `반대 신호도 있습니다: ${counterSignals[0].description}`
      : "강한 반대 신호가 없더라도, 단일 지표만으로 방향을 확정하지 않습니다.",
    missingMetrics.length > 0
      ? `${missingMetrics.length}개 지표가 데이터 없음 상태라 일부 해석은 보류합니다.`
      : "사용 가능한 지표만 근거로 해설을 만들었습니다.",
  ];

  return {
    headline,
    summary,
    primarySignal,
    counterSignals,
    unknowns,
    recommendedLessons,
    sourceMetricIds: Array.from(new Set(metrics.map((metric) => metric.metricId))),
    generatedAt: new Date().toISOString(),
    generationMode: "rule",
    confidence: liveRatio >= 0.7 ? "high" : liveRatio >= 0.35 ? "medium" : "low",
  };
}
