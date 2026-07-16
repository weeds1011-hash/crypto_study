import { lessons } from "@/content/lessons/seed";
import { universityLessonsById } from "@/content/courses/university";
import { coinProfiles } from "@/features/onchain/coin-profiles";
import type { NormalizedNewsItem } from "@/server/providers/types";
import type { MetricSnapshot } from "@/types";

export type GraphNodeType = "lesson" | "metric" | "news" | "coin" | "chain";

export interface KnowledgeNode {
  id: string;
  type: GraphNodeType;
  label: string;
  summary: string;
}

export interface KnowledgeEdge {
  sourceId: string;
  targetId: string;
  relation: "explains" | "uses_metric" | "mentions" | "belongs_to" | "impacts_path" | "related_to";
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export function buildKnowledgeGraph(metrics: MetricSnapshot[], news: NormalizedNewsItem[]): KnowledgeGraph {
  const lessonNodes = lessons.map<KnowledgeNode>((lesson) => ({
    id: lesson.slug,
    type: "lesson",
    label: lesson.title,
    summary: lesson.summary,
  }));
  const metricNodes = metrics.map<KnowledgeNode>((metric) => ({
    id: metric.metricId,
    type: "metric",
    label: metric.label,
    summary: `${metric.interpretation} 상태: ${metric.dataStatus}. 출처: ${metric.sourceId}.`,
  }));
  const newsNodes = news.map<KnowledgeNode>((item) => ({
    id: item.id,
    type: "news",
    label: item.title,
    summary: item.summary ?? `${item.source}의 ${item.category} 뉴스입니다.`,
  }));
  const coinNodes = coinProfiles.map<KnowledgeNode>((coin) => ({
    id: coin.symbol,
    type: "coin",
    label: coin.name,
    summary: coin.oneLine,
  }));
  const chainNodes = coinProfiles.map<KnowledgeNode>((coin) => ({
    id: coin.chainId,
    type: "chain",
    label: coin.name,
    summary: coin.networkActivity,
  }));

  const lessonMetricEdges = lessons.flatMap((lesson) => {
    const universityLesson = universityLessonsById.get(lesson.slug);
    const metricEdges = lesson.relatedMetricIds.map<KnowledgeEdge>((metricId) => ({ sourceId: lesson.slug, targetId: metricId, relation: "uses_metric" }));
    const coinEdges = (universityLesson?.relatedCoins ?? []).map<KnowledgeEdge>((coinId) => ({ sourceId: lesson.slug, targetId: coinId, relation: "related_to" }));
    const newsEdges = (universityLesson?.relatedNewsTags ?? []).map<KnowledgeEdge>((tag) => ({ sourceId: lesson.slug, targetId: tag, relation: "mentions" }));
    const glossaryEdges = (universityLesson?.glossaryTerms ?? []).map<KnowledgeEdge>((term) => ({ sourceId: lesson.slug, targetId: term, relation: "explains" }));
    const prerequisiteEdges = lesson.prerequisites.map<KnowledgeEdge>((prerequisite) => ({ sourceId: prerequisite, targetId: lesson.slug, relation: "related_to" }));
    return [...metricEdges, ...coinEdges, ...newsEdges, ...glossaryEdges, ...prerequisiteEdges];
  });
  const newsEdges = news.flatMap((item) => [
    ...item.relatedMetricIds.map<KnowledgeEdge>((metricId) => ({ sourceId: item.id, targetId: metricId, relation: "impacts_path" })),
    ...item.relatedLessonIds.map<KnowledgeEdge>((lessonId) => ({ sourceId: item.id, targetId: lessonId, relation: "related_to" })),
  ]);
  const coinEdges = coinProfiles.flatMap((coin) => [
    { sourceId: coin.symbol, targetId: coin.chainId, relation: "belongs_to" as const },
    ...coin.relatedLessons.map<KnowledgeEdge>((lessonId) => ({ sourceId: coin.symbol, targetId: lessonId, relation: "explains" })),
  ]);

  return {
    nodes: [...lessonNodes, ...metricNodes, ...newsNodes, ...coinNodes, ...chainNodes],
    edges: [...lessonMetricEdges, ...newsEdges, ...coinEdges],
  };
}

export function relatedNodeIds(graph: KnowledgeGraph, id: string) {
  return new Set(
    graph.edges
      .filter((edge) => edge.sourceId === id || edge.targetId === id)
      .flatMap((edge) => [edge.sourceId, edge.targetId])
      .filter((nodeId) => nodeId !== id),
  );
}
