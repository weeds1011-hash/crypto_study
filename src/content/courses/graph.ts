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
  relation: "prerequisite" | "next" | "related_lesson" | "lesson_metric" | "metric_news" | "news_coin" | "coin_chain" | "chain_macro" | "glossary";
}

export function buildUniversityKnowledgeGraph(lessons: UniversityLesson[] = universityLessons) {
  const lessonNodes = lessons.map<UniversityGraphNode>((item) => ({ id: item.slug, type: "lesson", label: item.title }));
  const layeredEdges = lessons.flatMap<UniversityGraphEdge>((item) => [
    ...item.prerequisites.map((id) => ({ sourceId: id, targetId: item.slug, relation: "prerequisite" as const })),
    ...(item.nextLesson ? [{ sourceId: item.slug, targetId: item.nextLesson, relation: "next" as const }] : []),
    ...item.relatedLessons.map((id) => ({ sourceId: item.slug, targetId: id, relation: "related_lesson" as const })),
    ...item.relatedMetrics.map((id) => ({ sourceId: item.slug, targetId: id, relation: "lesson_metric" as const })),
    ...item.relatedMetrics.flatMap((metricId) => item.relatedNewsTopics.map((newsId) => ({ sourceId: metricId, targetId: newsId, relation: "metric_news" as const }))),
    ...item.relatedNewsTopics.flatMap((newsId) => item.relatedCoins.map((coinId) => ({ sourceId: newsId, targetId: coinId, relation: "news_coin" as const }))),
    ...item.relatedCoins.flatMap((coinId) => meaningfulCoinChainEdges(coinId, item.relatedChains)),
    ...item.relatedChains.flatMap((chainId) => item.relatedMacroFactors.map((macroId) => ({ sourceId: chainId, targetId: macroId, relation: "chain_macro" as const }))),
    ...item.glossaryTerms.map((id) => ({ sourceId: item.slug, targetId: id, relation: "glossary" as const })),
  ]);

  return {
    nodes: [
      ...lessonNodes,
      ...uniqueNodes(lessons.flatMap((item) => item.relatedMetrics), "metric"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedNewsTopics), "news"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedCoins), "coin"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedChains), "chain"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedMacroFactors), "macro"),
      ...uniqueNodes(lessons.flatMap((item) => item.glossaryTerms), "glossary"),
    ],
    edges: dedupeEdges(layeredEdges),
  };
}

export function validateUniversitySchema(lessons: UniversityLesson[] = universityLessons) {
  const ids = new Set(lessons.map((item) => item.slug));
  const courseIds = new Set(courses.map((course) => course.id));
  const courseLessonIds = new Set(courses.flatMap((course) => course.lessonIds));
  return lessons.every((item) => (
    item.id === item.slug &&
    item.slug.length > 0 &&
    item.title.length > 0 &&
    item.shortSummary.length > 0 &&
    item.oneLineSummary === item.shortSummary &&
    item.learningObjectives.length > 0 &&
    item.explanation.length > 0 &&
    item.whyItMatters.length > 0 &&
    item.moneyFlowPosition.length > 0 &&
    item.marketConnection.length > 0 &&
    item.currentMarketConnection === item.marketConnection &&
    item.relatedMetrics.length > 0 &&
    item.relatedCoins.length > 0 &&
    item.relatedNewsTopics.length > 0 &&
    item.relatedNewsTags.length > 0 &&
    item.relatedChains.length > 0 &&
    item.relatedMacroFactors.length > 0 &&
    item.aiMentorPrompts.length > 0 &&
    item.aiMentorQuestions.length > 0 &&
    item.relatedLessons.every((id) => ids.has(id)) &&
    item.prerequisites.every((id) => ids.has(id)) &&
    item.prerequisiteLessons.every((id) => ids.has(id)) &&
    (item.previousLesson == null || ids.has(item.previousLesson)) &&
    (item.nextLesson == null || ids.has(item.nextLesson)) &&
    item.estimatedReadingTime > 0 &&
    item.estimatedMinutes === item.estimatedReadingTime &&
    item.quiz.length > 0 &&
    courseIds.has(item.courseId) &&
    courseLessonIds.has(item.slug)
  ));
}

export function hasPrerequisiteCycle(lessons: UniversityLesson[] = universityLessons) {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const byId = new Map(lessons.map((item) => [item.slug, item]));

  function visit(id: string): boolean {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const item = byId.get(id);
    const cycle = item?.prerequisites.some(visit) ?? false;
    visiting.delete(id);
    visited.add(id);
    return cycle;
  }

  return lessons.some((item) => visit(item.slug));
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

const assetChainMap: Record<string, string[]> = {
  btc: ["bitcoin"],
  eth: ["ethereum"],
  sol: ["solana"],
  ada: ["cardano"],
  avax: ["avalanche"],
  xrp: ["xrp-ledger"],
  matic: ["polygon"],
  arb: ["arbitrum"],
  op: ["optimism"],
  usdc: ["ethereum"],
  usdt: ["ethereum"],
  uni: ["ethereum"],
  aave: ["ethereum"],
  link: ["ethereum"],
  maker: ["ethereum"],
};

function meaningfulCoinChainEdges(coinId: string, lessonChains: string[]): UniversityGraphEdge[] {
  const chains = assetChainMap[coinId] ?? [];
  return chains
    .filter((chainId) => lessonChains.includes(chainId))
    .map((chainId) => ({ sourceId: coinId, targetId: chainId, relation: "coin_chain" as const }));
}
