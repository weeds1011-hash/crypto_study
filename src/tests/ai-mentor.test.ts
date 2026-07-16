import { describe, expect, it } from "vitest";
import { buildMentorAnswer, answerContainsForbiddenAdvice } from "@/features/ai-mentor/answer";
import { buildFlowDiagram } from "@/features/ai-mentor/diagram";
import { buildKnowledgeGraph } from "@/features/ai-mentor/knowledge-graph";
import { createRetrievalContext, retrieveFromApp } from "@/features/ai-mentor/retrieval";
import { buildStudyCoach } from "@/features/ai-mentor/study-coach";
import { mockMetrics } from "@/features/market-data/mock";
import type { NormalizedNewsItem } from "@/server/providers/types";

const news: NormalizedNewsItem[] = [
  {
    id: "n-stablecoin",
    title: "Stablecoin regulation update",
    source: "Test News",
    sourceUrl: "https://example.com",
    articleUrl: "https://example.com/stablecoin",
    publishedAt: new Date().toISOString(),
    category: "stablecoin",
    summary: "Stablecoin policy may affect market liquidity paths.",
    relatedMetricIds: ["stablecoin_supply"],
    relatedLessonIds: ["stablecoins", "money-flow"],
    impactPath: ["규제", "스테이블코인", "거래소 유동성"],
    dataStatus: "live",
  },
];

describe("AI Crypto Mentor retrieval", () => {
  it("builds a lesson-metric-news-coin-chain knowledge graph", () => {
    const graph = buildKnowledgeGraph(mockMetrics, news);

    expect(graph.nodes.some((node) => node.type === "lesson" && node.id === "stablecoins")).toBe(true);
    expect(graph.nodes.some((node) => node.type === "metric" && node.id === "stablecoin_supply")).toBe(true);
    expect(graph.nodes.some((node) => node.type === "news" && node.id === "n-stablecoin")).toBe(true);
    expect(graph.edges.some((edge) => edge.sourceId === "stablecoins" && edge.targetId === "stablecoin_supply")).toBe(true);
  });

  it("retrieves only app-provided context for a question", () => {
    const context = createRetrievalContext(mockMetrics, news);
    const retrieved = retrieveFromApp("스테이블코인 공급이 왜 중요해?", context);

    expect(retrieved.metrics.some((metric) => metric.metricId === "stablecoin_supply")).toBe(true);
    expect(retrieved.news[0].id).toBe("n-stablecoin");
    expect(retrieved.lessons.some((lesson) => lesson.slug === "stablecoins")).toBe(true);
  });
});

describe("AI Crypto Mentor answer", () => {
  it("returns the required answer sections without forbidden advice", () => {
    const retrieved = retrieveFromApp("BTC 사도 돼?", createRetrievalContext(mockMetrics, news));
    const answer = buildMentorAnswer("BTC 사도 돼?", retrieved);

    expect(answer.question).toBe("BTC 사도 돼?");
    expect(answer.summary).toHaveLength(3);
    expect(answer.evidenceData.length).toBeGreaterThan(0);
    expect(answer.relatedNews.length).toBeGreaterThan(0);
    expect(answer.relatedLessons.length).toBeGreaterThan(0);
    expect(answer.glossary.length).toBeGreaterThan(0);
    expect(answer.cautions.join(" ")).toContain("투자 추천이 아닙니다");
    expect(answerContainsForbiddenAdvice(answer)).toBe(false);
  });

  it("generates a Mermaid money-flow diagram from retrieved context", () => {
    const retrieved = retrieveFromApp("Fed Dollar BTC ETH Alt 흐름", createRetrievalContext(mockMetrics, news));
    const diagram = buildFlowDiagram(retrieved);

    expect(diagram.mermaid).toContain("flowchart LR");
    expect(diagram.mermaid).toContain("Fed");
    expect(diagram.mermaid).toContain("BTC");
  });

  it("recommends the next lesson and a review quiz", () => {
    const coach = buildStudyCoach(["what-is-money"]);

    expect(coach.nextLesson?.href).toBe("/learn/what-is-crypto");
    expect(coach.reviewQuiz.question.length).toBeGreaterThan(0);
  });
});
