import { courses, universityLessons, type UniversityLesson } from "./university";

export type UniversityGraphNodeType = "lesson" | "metric" | "news" | "coin" | "chain" | "macro" | "glossary";

export interface UniversityGraphNode {
  id: string;
  type: UniversityGraphNodeType;
  label: string;
}

export interface UniversityGraphEdge {
  sourceId: string;
  targetId: string;
  relation: "prerequisite" | "next" | "lesson_metric" | "metric_news" | "news_coin" | "coin_chain" | "chain_macro" | "glossary";
}

export function buildUniversityKnowledgeGraph(lessons: UniversityLesson[] = universityLessons) {
  const lessonNodes = lessons.map<UniversityGraphNode>((item) => ({ id: item.id, type: "lesson", label: item.title }));
  const layeredEdges = lessons.flatMap<UniversityGraphEdge>((item) => [
    ...item.prerequisiteLessons.map((id) => ({ sourceId: id, targetId: item.id, relation: "prerequisite" as const })),
    ...(item.nextLesson ? [{ sourceId: item.id, targetId: item.nextLesson, relation: "next" as const }] : []),
    ...item.relatedMetrics.map((id) => ({ sourceId: item.id, targetId: id, relation: "lesson_metric" as const })),
    ...item.relatedMetrics.flatMap((metricId) => item.relatedNews.map((newsId) => ({ sourceId: metricId, targetId: newsId, relation: "metric_news" as const }))),
    ...item.relatedNews.flatMap((newsId) => item.relatedCoins.map((coinId) => ({ sourceId: newsId, targetId: coinId, relation: "news_coin" as const }))),
    ...item.relatedCoins.flatMap((coinId) => item.relatedChains.map((chainId) => ({ sourceId: coinId, targetId: chainId, relation: "coin_chain" as const }))),
    ...item.relatedChains.flatMap((chainId) => item.relatedMacroFactors.map((macroId) => ({ sourceId: chainId, targetId: macroId, relation: "chain_macro" as const }))),
    ...item.glossaryTerms.map((id) => ({ sourceId: item.id, targetId: id, relation: "glossary" as const })),
  ]);

  return {
    nodes: [
      ...lessonNodes,
      ...uniqueNodes(lessons.flatMap((item) => item.relatedMetrics), "metric"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedNews), "news"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedCoins), "coin"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedChains), "chain"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedMacroFactors), "macro"),
      ...uniqueNodes(lessons.flatMap((item) => item.glossaryTerms), "glossary"),
    ],
    edges: dedupeEdges(layeredEdges),
  };
}

export function validateUniversitySchema(lessons: UniversityLesson[] = universityLessons) {
  const ids = new Set(lessons.map((item) => item.id));
  const courseIds = new Set(courses.map((course) => course.id));
  return lessons.every((item) => (
    item.id.length > 0 &&
    item.title.length > 0 &&
    item.oneLineSummary.length > 0 &&
    item.whyItMatters.length > 0 &&
    item.moneyFlowPosition.length > 0 &&
    item.currentMarketConnection.length > 0 &&
    Array.isArray(item.prerequisiteLessons) &&
    Array.isArray(item.relatedMetrics) &&
    Array.isArray(item.relatedNews) &&
    Array.isArray(item.relatedNewsTags) &&
    Array.isArray(item.relatedCoins) &&
    Array.isArray(item.relatedChains) &&
    Array.isArray(item.relatedMacroFactors) &&
    Array.isArray(item.glossaryTerms) &&
    Array.isArray(item.aiMentorQuestions) &&
    item.aiMentorQuestions.length > 0 &&
    item.quiz.length > 0 &&
    (item.nextLesson == null || ids.has(item.nextLesson)) &&
    courseIds.has(item.courseId)
  ));
}

export function hasPrerequisiteCycle(lessons: UniversityLesson[] = universityLessons) {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const byId = new Map(lessons.map((item) => [item.id, item]));

  function visit(id: string): boolean {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const item = byId.get(id);
    const cycle = item?.prerequisiteLessons.some(visit) ?? false;
    visiting.delete(id);
    visited.add(id);
    return cycle;
  }

  return lessons.some((item) => visit(item.id));
}

function uniqueNodes(ids: string[], type: UniversityGraphNodeType) {
  return Array.from(new Set(ids)).map<UniversityGraphNode>((id) => ({ id, type, label: id }));
}

function dedupeEdges(edges: UniversityGraphEdge[]) {
  const seen = new Set<string>();
  return edges.filter((edge) => {
    const key = `${edge.sourceId}|${edge.targetId}|${edge.relation}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
