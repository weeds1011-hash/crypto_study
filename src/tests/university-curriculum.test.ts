import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { courseForLesson, courses, moduleForLesson, toLegacyLesson, universityLessons, universityLessonsById } from "@/content/courses/university";
import { buildUniversityKnowledgeGraph, hasPrerequisiteCycle, validateUniversitySchema } from "@/content/courses/graph";
import { lessons } from "@/content/lessons/seed";
import { buildKnowledgeGraph } from "@/features/ai-mentor/knowledge-graph";
import { mockMetrics } from "@/features/market-data/mock";

const root = process.cwd();
const requiredCourseTitles = ["Money Foundations", "Macro Economy", "Money Flow", "Crypto Foundations", "Market Intelligence"];
const cryptoCoverageTerms = [
  "암호화폐",
  "블록체인",
  "개인키",
  "시드 문구",
  "수수료",
  "채굴",
  "Proof of Work",
  "Proof of Stake",
  "스테이킹",
  "Layer 1",
  "Layer 2",
  "코인",
  "토큰",
  "스마트 계약",
  "스테이블코인",
  "탈중앙화 거래소",
  "대출 프로토콜",
  "오라클",
  "브릿지",
  "NFT",
  "거버넌스 토큰",
  "밈코인",
  "프라이버시 코인",
  "거래소 토큰",
  "실물자산 토큰",
];

describe("Money Flow Academy curriculum schema", () => {
  it("defines the required five courses with ordered lesson lists", () => {
    expect(courses.map((course) => course.title)).toEqual(requiredCourseTitles);
    for (const course of courses) {
      expect(course.lessonIds.length).toBeGreaterThanOrEqual(3);
      for (const lessonId of course.lessonIds) {
        expect(universityLessonsById.has(lessonId)).toBe(true);
      }
    }
  });

  it("requires every phase 7 lesson metadata field", () => {
    expect(validateUniversitySchema(universityLessons)).toBe(true);
    for (const lesson of universityLessons) {
      expect(lesson.id).toBe(lesson.slug);
      expect(lesson.title).toBeTruthy();
      expect(lesson.shortSummary).toBeTruthy();
      expect(lesson.learningObjectives.length).toBeGreaterThan(0);
      expect(lesson.explanation).toBeTruthy();
      expect(lesson.whyItMatters).toBeTruthy();
      expect(lesson.moneyFlowPosition).toBeTruthy();
      expect(lesson.marketConnection).toBeTruthy();
      expect(lesson.relatedMetrics.length).toBeGreaterThan(0);
      expect(lesson.relatedCoins.length).toBeGreaterThan(0);
      expect(lesson.relatedNewsTopics.length).toBeGreaterThan(0);
      expect(lesson.aiMentorPrompts.length).toBeGreaterThan(0);
      expect("nextLesson" in lesson).toBe(true);
      expect(Array.isArray(lesson.prerequisites)).toBe(true);
      expect(lesson.estimatedReadingTime).toBeGreaterThan(0);
      expect(["beginner", "intermediate", "advanced"]).toContain(lesson.difficulty);
    }
  });

  it("prevents prerequisite cycles", () => {
    expect(hasPrerequisiteCycle(universityLessons)).toBe(false);
    expect(hasPrerequisiteCycle([
      { ...universityLessons[0], slug: "a", id: "a", prerequisites: ["b"], prerequisiteLessons: ["b"], nextLesson: "b" },
      { ...universityLessons[1], slug: "b", id: "b", prerequisites: ["a"], prerequisiteLessons: ["a"], nextLesson: "a" },
    ])).toBe(true);
  });

  it("maps new schema into the legacy lesson shape used by current UI", () => {
    const legacy = toLegacyLesson(universityLessons[0]);

    expect(legacy.slug).toBe(universityLessons[0].slug);
    expect(legacy.summary).toBe(universityLessons[0].shortSummary);
    expect(legacy.relatedMetricIds).toEqual(universityLessons[0].relatedMetrics);
    expect(legacy.examples.some((item) => item.title === "학습 목표")).toBe(true);
    expect(legacy.examples.some((item) => item.title === "돈의 흐름에서 위치")).toBe(true);
    expect(lessons.length).toBe(universityLessons.length);
  });

  it("resolves course and module placement for lesson pages", () => {
    expect(courseForLesson("money-flow")?.title).toBe("Money Flow");
    expect(courseForLesson("stablecoins")?.title).toBe("Crypto Foundations");
    expect(moduleForLesson("stablecoins")).toEqual({ index: 5, title: "Module 5", total: 8 });
  });

  it("supports previous, next, related lessons, and prerequisites", () => {
    const lesson = universityLessonsById.get("stablecoin-pipeline");

    expect(lesson?.previousLesson).toBe("money-flow");
    expect(lesson?.nextLesson).toBe("exchange-chain-flow");
    expect(lesson?.relatedLessons).toContain("stablecoins");
    expect(lesson?.prerequisites).toContain("money-flow");
  });

  it("keeps the full beginner journey in one natural sequence across courses", () => {
    const first = universityLessons.find((lesson) => lesson.previousLesson == null);
    const visited: string[] = [];
    let current = first;

    while (current) {
      visited.push(current.slug);
      current = current.nextLesson ? universityLessonsById.get(current.nextLesson) : undefined;
    }

    expect(visited).toEqual(courses.flatMap((course) => course.lessonIds));
    for (const lesson of universityLessons) {
      if (lesson.nextLesson) {
        expect(universityLessonsById.get(lesson.nextLesson)?.previousLesson).toBe(lesson.slug);
      }
    }
  });

  it("covers the required beginner crypto foundation topics without adding app features", () => {
    const cryptoLessons = universityLessons.filter((lesson) => lesson.courseId === "crypto-foundations");
    const cryptoText = cryptoLessons
      .map((lesson) => [
        lesson.title,
        lesson.shortSummary,
        lesson.explanation,
        lesson.whyItMatters,
        lesson.learningObjectives.join(" "),
        lesson.aiMentorPrompts.join(" "),
        lesson.quiz.map((quiz) => `${quiz.question} ${quiz.options.join(" ")} ${quiz.explanation}`).join(" "),
      ].join(" "))
      .join(" ");

    expect(cryptoLessons.map((lesson) => lesson.slug)).toEqual([
      "what-is-crypto",
      "blockchain-wallets",
      "consensus-transactions",
      "bitcoin-ethereum",
      "stablecoins",
      "crypto-classifications",
      "protocols-and-applications",
      "tokenomics",
    ]);
    for (const term of cryptoCoverageTerms) {
      expect(cryptoText).toContain(term);
    }
  });
});

describe("Money Flow Academy knowledge graph", () => {
  it("connects every lesson to metric to news topic to coin to chain to macro topic", () => {
    const graph = buildUniversityKnowledgeGraph(universityLessons);

    for (const lesson of universityLessons) {
      expect(graph.edges.some((edge) => edge.sourceId === lesson.slug && edge.relation === "lesson_metric")).toBe(true);
      for (const metricId of lesson.relatedMetrics) {
        expect(graph.edges.some((edge) => edge.sourceId === metricId && edge.relation === "metric_news")).toBe(true);
      }
      for (const newsTopic of lesson.relatedNewsTopics) {
        expect(graph.edges.some((edge) => edge.sourceId === newsTopic && edge.relation === "news_coin")).toBe(true);
      }
      for (const coinId of lesson.relatedCoins) {
        expect(graph.edges.some((edge) => edge.sourceId === coinId && edge.relation === "coin_chain")).toBe(true);
      }
      for (const chainId of lesson.relatedChains) {
        expect(graph.edges.some((edge) => edge.sourceId === chainId && edge.relation === "chain_macro")).toBe(true);
      }
    }
  });

  it("keeps glossary and lesson navigation links available for the learning UI", () => {
    const graph = buildUniversityKnowledgeGraph(universityLessons);
    const stablecoinEdges = graph.edges.filter((edge) => edge.sourceId === "stablecoins" || edge.targetId === "stablecoins");

    expect(stablecoinEdges.some((edge) => edge.relation === "prerequisite")).toBe(true);
    expect(stablecoinEdges.some((edge) => edge.relation === "related_lesson")).toBe(true);
    expect(stablecoinEdges.some((edge) => edge.relation === "glossary" && edge.targetId === "스테이블코인")).toBe(true);
  });

  it("does not create meaningless coin-to-chain references", () => {
    const graph = buildUniversityKnowledgeGraph(universityLessons);

    expect(graph.edges.some((edge) => edge.sourceId === "btc" && edge.targetId === "ethereum" && edge.relation === "coin_chain")).toBe(false);
    expect(graph.edges.some((edge) => edge.sourceId === "eth" && edge.targetId === "bitcoin" && edge.relation === "coin_chain")).toBe(false);
    expect(graph.edges.some((edge) => edge.sourceId === "sol" && edge.targetId === "ethereum" && edge.relation === "coin_chain")).toBe(false);
    expect(graph.edges.some((edge) => edge.sourceId === "btc" && edge.targetId === "bitcoin" && edge.relation === "coin_chain")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "eth" && edge.targetId === "ethereum" && edge.relation === "coin_chain")).toBe(true);
  });

  it("exposes academy links through the mentor graph compatibility layer", () => {
    const graph = buildKnowledgeGraph(mockMetrics, []);

    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "stablecoin_supply")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "btc")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "스테이블코인")).toBe(true);
  });
});

describe("Money Flow Academy learning flow UX", () => {
  it("keeps the learn page organized around the existing flow", () => {
    const source = fs.readFileSync(path.join(root, "src/app/learn/page.tsx"), "utf8");

    expect(source).toContain("Course → Module → Lesson → Quiz → Next Lesson");
    expect(source).toContain("LearningProgressInline");
  });

  it("renders lesson pages with breadcrumb, prerequisites, market links, and navigation", () => {
    const source = fs.readFileSync(path.join(root, "src/app/learn/[slug]/page.tsx"), "utf8");
    const flowNav = fs.readFileSync(path.join(root, "src/components/learning/LessonFlowNav.tsx"), "utf8");

    expect(source).toContain("LearningBreadcrumb");
    expect(source).toContain("PrerequisiteStatus");
    expect(source).toContain("MarketMetricLinks");
    expect(source).toContain("이전 수업");
    expect(source).toContain("관련 수업");
    expect(flowNav).toContain("fixed inset-x-0 bottom-0");
    expect(flowNav).toContain("min-h-11");
  });

  it("puts the home page money flow question before the market brief", () => {
    const source = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");

    expect(source).toContain("오늘 돈은 어디로 움직이고 있는가?");
    expect(source.indexOf("<section id=\"flow\"")).toBeLessThan(source.indexOf("<MarketBriefCard brief={brief}"));
  });
});
