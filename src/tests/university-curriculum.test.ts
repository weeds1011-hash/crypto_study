import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { courseForLesson, courses, moduleForLesson, toLegacyLesson, universityLessons } from "@/content/courses/university";
import { buildUniversityKnowledgeGraph, hasPrerequisiteCycle, validateUniversitySchema } from "@/content/courses/graph";
import { lessons } from "@/content/lessons/seed";
import { buildKnowledgeGraph } from "@/features/ai-mentor/knowledge-graph";
import { mockMetrics } from "@/features/market-data/mock";

const root = process.cwd();

describe("Money Flow Academy curriculum schema", () => {
  it("defines the required five courses", () => {
    expect(courses.map((course) => course.title)).toEqual(["Money Foundations", "Macro Economy", "Money Flow", "Crypto Foundations", "Market Intelligence"]);
  });

  it("requires every academy lesson schema field", () => {
    expect(validateUniversitySchema(universityLessons)).toBe(true);
    for (const lesson of universityLessons) {
      expect(lesson.id).toBeTruthy();
      expect(lesson.title).toBeTruthy();
      expect(lesson.oneLineSummary).toBeTruthy();
      expect(lesson.whyItMatters).toBeTruthy();
      expect(lesson.moneyFlowPosition).toBeTruthy();
      expect(lesson.currentMarketConnection).toBeTruthy();
      expect(Array.isArray(lesson.prerequisiteLessons)).toBe(true);
      expect(Array.isArray(lesson.relatedMetrics)).toBe(true);
      expect(Array.isArray(lesson.relatedNews)).toBe(true);
      expect(Array.isArray(lesson.relatedNewsTags)).toBe(true);
      expect(Array.isArray(lesson.relatedCoins)).toBe(true);
      expect(Array.isArray(lesson.relatedChains)).toBe(true);
      expect(Array.isArray(lesson.relatedMacroFactors)).toBe(true);
      expect(Array.isArray(lesson.aiMentorQuestions)).toBe(true);
      expect(lesson.aiMentorQuestions.length).toBeGreaterThan(0);
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
    expect(legacy.examples.some((item) => item.title === "돈의 흐름에서 위치")).toBe(true);
    expect(lessons.length).toBe(universityLessons.length);
  });

  it("resolves course and module placement for lesson pages", () => {
    expect(courseForLesson("money-flow")?.title).toBe("Money Flow");
    expect(courseForLesson("stablecoins")?.title).toBe("Crypto Foundations");
    expect(moduleForLesson("stablecoins")).toEqual({ index: 3, title: "Module 3", total: 4 });
  });
});

describe("Money Flow Academy knowledge graph", () => {
  it("connects lesson to metric to news to coin to chain to macro", () => {
    const graph = buildUniversityKnowledgeGraph(universityLessons);

    expect(graph.edges.some((edge) => edge.sourceId === "money-flow" && edge.targetId === "stablecoin_supply" && edge.relation === "lesson_metric")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoin_supply" && edge.targetId === "stablecoin" && edge.relation === "metric_news")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoin" && edge.targetId === "btc" && edge.relation === "news_coin")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "btc" && edge.targetId === "bitcoin" && edge.relation === "coin_chain")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "bitcoin" && edge.targetId === "dollar-liquidity" && edge.relation === "chain_macro")).toBe(true);
  });

  it("keeps glossary and prerequisite links available for the learning UI", () => {
    const graph = buildUniversityKnowledgeGraph(universityLessons);
    const stablecoinEdges = graph.edges.filter((edge) => edge.sourceId === "stablecoins" || edge.targetId === "stablecoins");

    expect(stablecoinEdges.some((edge) => edge.relation === "prerequisite")).toBe(true);
    expect(stablecoinEdges.some((edge) => edge.relation === "glossary" && edge.targetId === "스테이블코인")).toBe(true);
  });

  it("exposes academy links through the mentor graph compatibility layer", () => {
    const graph = buildKnowledgeGraph(mockMetrics, []);

    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "stablecoin_supply")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "btc")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "스테이블코인")).toBe(true);
  });
});

describe("Money Flow Academy learning flow UX", () => {
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

  it("puts the home page money flow question before the market brief", () => {
    const source = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");

    expect(source).toContain("오늘 돈은 어디로 움직이고 있는가?");
    expect(source.indexOf("<section id=\"flow\"")).toBeLessThan(source.indexOf("<MarketBriefCard brief={brief}"));
  });
});
