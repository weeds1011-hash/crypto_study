import type { Lesson, MetricSnapshot } from "@/types";

export interface LessonRecommendation {
  lessonId: string;
  score: number;
  reasons: string[];
  relatedMetricIds: string[];
  prerequisiteStatus: "ready" | "missing" | "completed";
  recommendationType: "market-related" | "next-step" | "review" | "beginner-essential";
}

function readCompletionFromSlugs(completedSlugs: string[], lesson: Lesson): LessonRecommendation["prerequisiteStatus"] {
  if (completedSlugs.includes(lesson.slug)) return "completed";
  if (lesson.prerequisites.every((slug) => completedSlugs.includes(slug))) return "ready";
  return "missing";
}

function metricActivity(metric: MetricSnapshot) {
  const changes = [metric.change24h, metric.change7d, metric.change30d].filter((value): value is number => value != null);
  if (changes.length === 0) return 0;
  return Math.max(...changes.map((value) => Math.abs(value)));
}

export function recommendLessons(lessons: Lesson[], metrics: MetricSnapshot[], completedSlugs: string[] = []): LessonRecommendation[] {
  const recent = new Set<string>();
  const metricById = new Map(metrics.map((metric) => [metric.metricId, metric]));

  const recommendations = lessons
    .map((lesson) => {
      const prerequisiteStatus = readCompletionFromSlugs(completedSlugs, lesson);
      const relatedMetrics = lesson.relatedMetricIds.map((id) => metricById.get(id)).filter((metric): metric is MetricSnapshot => metric != null);
      const activeMetricScore = relatedMetrics.reduce((score, metric) => score + metricActivity(metric), 0);
      const uncompletedBoost = completedSlugs.includes(lesson.slug) ? -12 : 12;
      const prerequisiteBoost = prerequisiteStatus === "ready" ? 8 : prerequisiteStatus === "missing" ? -8 : -4;
      const beginnerBoost = lesson.difficulty === "beginner" ? 4 : 0;
      const score = activeMetricScore + uncompletedBoost + prerequisiteBoost + beginnerBoost;
      const type: LessonRecommendation["recommendationType"] =
        completedSlugs.includes(lesson.slug)
          ? "review"
          : relatedMetrics.length > 0 && activeMetricScore > 0
          ? "market-related"
          : prerequisiteStatus === "ready"
            ? "next-step"
            : "beginner-essential";

      return {
        lessonId: lesson.slug,
        score: Number(score.toFixed(2)),
        reasons: [
          relatedMetrics.length > 0
            ? `${relatedMetrics.map((metric) => metric.label).join(", ")} 지표와 연결됩니다.`
            : "현재 시장 지표와 직접 연결된 수업은 아니지만 기초 이해에 필요합니다.",
          prerequisiteStatus === "missing" ? "선수 학습이 아직 남아 있습니다." : "현재 학습 단계에서 바로 볼 수 있습니다.",
          completedSlugs.includes(lesson.slug) ? "이미 완료한 수업이라 복습으로 분류했습니다." : "아직 완료하지 않은 수업입니다.",
        ],
        relatedMetricIds: lesson.relatedMetricIds,
        prerequisiteStatus,
        recommendationType: recent.has(lesson.slug) ? "review" : type,
      };
    })
    .sort((a, b) => b.score - a.score);

  const top = recommendations.slice(0, 4);
  const completedReview = recommendations.find((item) => item.prerequisiteStatus === "completed" && item.recommendationType === "review");
  if (completedReview && !top.some((item) => item.lessonId === completedReview.lessonId)) {
    return [...top.slice(0, 3), completedReview];
  }
  return top;
}
