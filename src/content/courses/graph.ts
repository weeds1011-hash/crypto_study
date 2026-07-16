import { courses, universityLessons, type UniversityLesson } from "./university";

export type UniversityGraphNodeType = "lesson" | "metric" | "coin" | "news" | "glossary";

export interface UniversityGraphNode {
  id: string;
  type: UniversityGraphNodeType;
  label: string;
}

export interface UniversityGraphEdge {
  sourceId: string;
  targetId: string;
  relation: "prerequisite" | "next" | "metric" | "coin" | "news" | "glossary";
}

export function buildUniversityKnowledgeGraph(lessons: UniversityLesson[] = universityLessons) {
  const lessonNodes = lessons.map<UniversityGraphNode>((item) => ({ id: item.id, type: "lesson", label: item.title }));
  const edges = lessons.flatMap<UniversityGraphEdge>((item) => [
    ...item.prerequisiteLessons.map((id) => ({ sourceId: id, targetId: item.id, relation: "prerequisite" as const })),
    ...(item.nextLesson ? [{ sourceId: item.id, targetId: item.nextLesson, relation: "next" as const }] : []),
    ...item.relatedMetrics.map((id) => ({ sourceId: item.id, targetId: id, relation: "metric" as const })),
    ...item.relatedCoins.map((id) => ({ sourceId: item.id, targetId: id, relation: "coin" as const })),
    ...item.relatedNewsTags.map((id) => ({ sourceId: item.id, targetId: id, relation: "news" as const })),
    ...item.glossaryTerms.map((id) => ({ sourceId: item.id, targetId: id, relation: "glossary" as const })),
  ]);
  return {
    nodes: [
      ...lessonNodes,
      ...uniqueNodes(lessons.flatMap((item) => item.relatedMetrics), "metric"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedCoins), "coin"),
      ...uniqueNodes(lessons.flatMap((item) => item.relatedNewsTags), "news"),
      ...uniqueNodes(lessons.flatMap((item) => item.glossaryTerms), "glossary"),
    ],
    edges,
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
    Array.isArray(item.prerequisiteLessons) &&
    Array.isArray(item.relatedMetrics) &&
    Array.isArray(item.relatedCoins) &&
    Array.isArray(item.relatedNewsTags) &&
    Array.isArray(item.glossaryTerms) &&
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
