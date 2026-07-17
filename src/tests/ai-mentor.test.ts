import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildMentorAnswer, answerContainsForbiddenAdvice, isInvestmentIntent, type MentorAnswer } from "@/features/ai-mentor/answer";
import { buildFlowDiagram, isAllowedDiagram, type MentorDiagram } from "@/features/ai-mentor/diagram";
import { buildKnowledgeGraph } from "@/features/ai-mentor/knowledge-graph";
import { createRetrievalContext, retrieveFromApp } from "@/features/ai-mentor/retrieval";
import { buildStudyCoach } from "@/features/ai-mentor/study-coach";
import { mockMetrics } from "@/features/market-data/mock";
import type { NormalizedNewsItem } from "@/server/providers/types";
import type { MetricSnapshot } from "@/types";

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

  it("excludes low relevance results for unrelated questions", () => {
    const context = createRetrievalContext(mockMetrics, news);
    const retrieved = retrieveFromApp("완전히 무관한 요리 레시피 질문", context);

    expect(retrieved.hasDirectResults).toBe(false);
    expect(retrieved.metrics).toHaveLength(0);
    expect(retrieved.news).toHaveLength(0);
  });
});

describe("AI Crypto Mentor answer", () => {
  it("returns the required answer sections without forbidden advice", () => {
    const retrieved = retrieveFromApp("BTC 사도 돼?", createRetrievalContext(mockMetrics, news));
    const answer = buildMentorAnswer("BTC 사도 돼?", retrieved);

    expect(answer.question).toBe("BTC 사도 돼?");
    expect(answer.summary).toHaveLength(3);
    expect(answer.evidenceData.length).toBeGreaterThan(0);
    expect(answer.relatedLessons.length).toBeGreaterThan(0);
    expect(answer.cautions.join(" ")).toContain("투자 추천이 아닙니다");
    expect(answerContainsForbiddenAdvice(answer)).toBe(false);
  });

  it("does not treat the user's original investment wording as generated advice", () => {
    const retrieved = retrieveFromApp("매수해야 하나요?", createRetrievalContext(mockMetrics, news));
    const answer = buildMentorAnswer("매수해야 하나요?", retrieved);

    expect(answer.summary[0]).toContain("투자 판단이나 가격 예측은 제공하지 않고");
    expect(answerContainsForbiddenAdvice(answer)).toBe(false);
  });

  it("fails if generated mentor output includes direct buy advice", () => {
    const unsafe: MentorAnswer = {
      question: "BTC 어때?",
      summary: ["매수하세요"],
      evidenceData: [],
      relatedNews: [],
      relatedLessons: [],
      glossary: [],
      cautions: [],
    };

    expect(answerContainsForbiddenAdvice(unsafe)).toBe(true);
  });

  it("does not flag educational wording about the term buy", () => {
    expect(isInvestmentIntent("매수라는 용어의 뜻은?")).toBe(false);
  });

  it("keeps price prediction requests in learning mode", () => {
    const answer = buildMentorAnswer("BTC 오를까?", retrieveFromApp("BTC 오를까?", createRetrievalContext(mockMetrics, news)));

    expect(answer.summary[0]).toContain("가격 예측은 제공하지 않고");
  });

  it("does not use mock or missing metrics as real-time evidence", () => {
    const missingMetric: MetricSnapshot = { ...mockMetrics[0], dataStatus: "missing", value: null };
    const retrieved = retrieveFromApp("암호화폐 시가총액", createRetrievalContext([missingMetric], []));
    const answer = buildMentorAnswer("암호화폐 시가총액", retrieved);

    expect(answer.evidenceData[0]).toContain("mock/missing 데이터는 실시간 근거로 사용하지 않습니다");
  });

  it("generates a Mermaid money-flow diagram from retrieved context", () => {
    const retrieved = retrieveFromApp("Fed Dollar BTC ETH Alt 흐름", createRetrievalContext(mockMetrics, news));
    const diagram = buildFlowDiagram(retrieved);

    expect(diagram.mermaid).toContain("flowchart LR");
    expect(diagram.mermaid).toContain("Fed");
    expect(diagram.mermaid).toContain("BTC");
    expect(isAllowedDiagram(diagram)).toBe(true);
  });

  it("rejects dangerous Mermaid node strings outside the allowlist", () => {
    const unsafe: MentorDiagram = {
      title: "unsafe",
      mermaid: "flowchart LR\nBad[<script>alert(1)</script>] --> BTC",
      nodes: [{ id: "Bad<script>", label: "Bad" }],
      edges: [{ source: "Bad<script>", target: "BTC", label: "x" }],
      fallbackPath: "연준·금리 -> BTC",
    };

    expect(isAllowedDiagram(unsafe)).toBe(false);
  });

  it("keeps fallback rendering path available for diagram failure", () => {
    const source = readFileSync(join(process.cwd(), "src", "components", "ai-mentor", "MentorDiagramView.tsx"), "utf8");

    expect(source).toContain("forceFallback");
    expect(source).toContain("FallbackPath");
  });

  it("recommends the next lesson and a review quiz", () => {
    const coach = buildStudyCoach(["what-is-money"]);

    expect(coach.nextLesson?.href).toBe("/learn/store-of-value-medium-unit");
    expect(coach.reviewQuiz.question.length).toBeGreaterThan(0);
  });

  it("keeps review explanation hidden until submission in the mentor component", () => {
    const source = readFileSync(join(process.cwd(), "src", "components", "ai-mentor", "MentorReviewQuiz.tsx"), "utf8");

    expect(source).toContain("!submitted");
    expect(source).toContain("답 제출");
    expect(source).toContain("다시 풀기");
  });
});
