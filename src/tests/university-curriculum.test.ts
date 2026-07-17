import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { courseForLesson, courses, moduleForLesson, toLegacyLesson, universityLessons } from "@/content/courses/university";
import { buildUniversityKnowledgeGraph, hasPrerequisiteCycle, validateUniversitySchema } from "@/content/courses/graph";
import { lessons } from "@/content/lessons/seed";
import { buildKnowledgeGraph } from "@/features/ai-mentor/knowledge-graph";
import { mockMetrics } from "@/features/market-data/mock";

const root = process.cwd();

describe("Crypto University curriculum schema", () => {
  it("defines the required four courses", () => {
    expect(courses.map((course) => course.title)).toEqual(["Money Foundations", "Macro Economy", "Crypto Foundations", "Market Intelligence"]);
  });

  it("requires every university lesson schema field", () => {
    expect(validateUniversitySchema(universityLessons)).toBe(true);
    for (const lesson of universityLessons) {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.oneLineSummary).toBeTruthy();
      expect(lesson.whyItMatters).toBeTruthy();
      expect(Array.isArray(lesson.prerequisiteLessons)).toBe(true);
      expect(Array.isArray(lesson.relatedMetrics)).toBe(true);
      expect(Array.isArray(lesson.relatedCoins)).toBe(true);
      expect(Array.isArray(lesson.relatedNewsTags)).toBe(true);
      expect(Array.isArray(lesson.glossaryTerms)).toBe(true);
      expect(lesson.quiz.length).toBeGreaterThan(0);
      expect("nextLesson" in lesson).toBe(true);
    }
  });

  it("prevents prerequisite cycles", () => {
    expect(hasPrerequisiteCycle(universityLessons)).toBe(false);
    expect(hasPrerequisiteCycle([
      { ...universityLessons[0], id: "a", prerequisiteLessons: ["b"], nextLesson: "b" },
      { ...universityLessons[1], id: "b", prerequisiteLessons: ["a"], nextLesson: "a" },
    ])).toBe(true);
  });

  it("maps new schema into the legacy lesson shape used by current UI", () => {
    const legacy = toLegacyLesson(universityLessons[0]);

    expect(legacy.slug).toBe(universityLessons[0].id);
    expect(legacy.summary).toBe(universityLessons[0].oneLineSummary);
    expect(legacy.relatedMetricIds).toEqual(universityLessons[0].relatedMetrics);
    expect(lessons.length).toBe(universityLessons.length);
  });

  it("resolves course and module placement for lesson pages", () => {
    expect(courseForLesson("stablecoins")?.title).toBe("Crypto Foundations");
    expect(moduleForLesson("stablecoins")).toEqual({ index: 3, title: "Module 3", total: 4 });
  });
});

describe("Crypto University knowledge graph", () => {
  it("connects lesson to lesson, metric, coin, news, and glossary", () => {
    const graph = buildUniversityKnowledgeGraph(universityLessons);
    const stablecoinEdges = graph.edges.filter((edge) => edge.sourceId === "stablecoins" || edge.targetId === "stablecoins");

    expect(stablecoinEdges.some((edge) => edge.relation === "prerequisite")).toBe(true);
    expect(stablecoinEdges.some((edge) => edge.relation === "metric" && edge.targetId === "stablecoin_supply")).toBe(true);
    expect(stablecoinEdges.some((edge) => edge.relation === "coin" && edge.targetId === "btc")).toBe(true);
    expect(stablecoinEdges.some((edge) => edge.relation === "news" && edge.targetId === "stablecoin")).toBe(true);
    expect(stablecoinEdges.some((edge) => edge.relation === "glossary" && edge.targetId === "스테이블코인")).toBe(true);
  });

  it("exposes university links through the mentor graph compatibility layer", () => {
    const graph = buildKnowledgeGraph(mockMetrics, []);

    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "stablecoin_supply")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "btc")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "스테이블코인")).toBe(true);
  });
});

describe("Crypto University learning flow UX", () => {
  it("keeps the learn page organized around the phase 6 flow", () => {
    const source = fs.readFileSync(path.join(root, "src/app/learn/page.tsx"), "utf8");

    expect(source).toContain("Course → Module → Lesson → Quiz → Next Lesson");
    expect(source).toContain("LearningProgressInline");
  });

  it("renders lesson pages with breadcrumb, prerequisites, market links, and mobile next navigation", () => {
    const source = fs.readFileSync(path.join(root, "src/app/learn/[slug]/page.tsx"), "utf8");
    const flowNav = fs.readFileSync(path.join(root, "src/components/learning/LessonFlowNav.tsx"), "utf8");

    expect(source).toContain("LearningBreadcrumb");
    expect(source).toContain("PrerequisiteStatus");
    expect(source).toContain("MarketMetricLinks");
    expect(flowNav).toContain("fixed inset-x-0 bottom-0");
    expect(flowNav).toContain("min-h-11");
  });
});
