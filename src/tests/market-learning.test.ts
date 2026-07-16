import { describe, expect, it } from "vitest";
import { deleteNote, listNotes, readAllNotes, saveNote, type StorageLike } from "@/components/notes/notes-storage";
import { lessons } from "@/content/lessons/seed";
import { selectDailyQuestion } from "@/features/daily-question/questions";
import { recommendLessons } from "@/features/lesson-recommendations/recommendations";
import { buildRuleMarketBrief } from "@/features/market-brief/market-brief.rules";
import { validateMarketBrief } from "@/features/market-brief/market-brief.validation";
import { mockMetrics } from "@/features/market-data/mock";
import { journeySteps } from "@/features/money-journey/journey";
import type { FlowSignal, MetricSnapshot } from "@/types";

const now = new Date().toISOString();

function storage(initial = "[]"): StorageLike {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key, nextValue) => {
      value = nextValue;
    },
  };
}

function liveMetric(metricId: string, change7d: number | null = 1): MetricSnapshot {
  return {
    metricId,
    label: metricId,
    value: 100,
    unit: "%",
    change24h: null,
    change7d,
    change30d: null,
    sourceId: "test",
    updatedAt: now,
    confidence: "high",
    isEstimated: false,
    dataStatus: "live",
    fieldStatus: {
      value: "live",
      change24h: "missing",
      change7d: change7d == null ? "missing" : "live",
      change30d: "missing",
      series: "missing",
    },
    interpretation: "test",
    caution: "test",
    series: [],
  };
}

const signal: FlowSignal = {
  id: "risk-to-crypto",
  sourceNode: "위험자산",
  targetNode: "암호화폐 시장",
  direction: "inflow",
  strength: 2,
  confidence: "medium",
  score: 1.4,
  dataCoverage: 0.75,
  liveMetricRatio: 1,
  reasons: [{ metricId: "crypto_market_cap", label: "시총", explanation: "전체 시가총액이 개선되는 쪽으로 관찰됩니다." }],
  counterSignals: [{ metricId: "stablecoin_supply", label: "스테이블코인", explanation: "스테이블코인 신호는 아직 약합니다." }],
  updatedAt: now,
};

describe("market brief", () => {
  it("builds a cautious rule-based brief with sources and counter signals", () => {
    const brief = buildRuleMarketBrief([liveMetric("crypto_market_cap"), liveMetric("stablecoin_supply")], [signal], lessons);

    expect(brief.generationMode).toBe("rule");
    expect(brief.headline).toContain("단정할 수 없습니다");
    expect(brief.sourceMetricIds).toContain("crypto_market_cap");
    expect(brief.counterSignals.length).toBe(1);
    expect(validateMarketBrief(brief)).toBe(true);
  });

  it("marks low confidence when live metric coverage is weak", () => {
    const missingMetric = { ...liveMetric("defi_tvl", null), dataStatus: "missing" as const, value: null };
    const brief = buildRuleMarketBrief([missingMetric], [{ ...signal, direction: "uncertain", dataCoverage: 0.25 }], lessons);

    expect(brief.confidence).toBe("low");
    expect(brief.unknowns.length).toBeGreaterThan(0);
  });

  it("rejects invalid brief shapes", () => {
    expect(validateMarketBrief({ headline: "missing fields" })).toBe(false);
  });
});

describe("lesson recommendations", () => {
  it("recommends lessons connected to active market metrics", () => {
    const recommendations = recommendLessons(lessons, [liveMetric("defi_tvl", 5)], []);

    expect(recommendations.some((item) => item.relatedMetricIds.includes("defi_tvl"))).toBe(true);
    expect(recommendations[0].score).toBeGreaterThan(0);
  });

  it("classifies completed lessons as review instead of next step", () => {
    const completed = "stablecoins";
    const recommendations = recommendLessons(lessons, [liveMetric("stablecoin_supply", 100)], [completed]);
    const completedRecommendation = recommendations.find((item) => item.lessonId === completed);

    expect(completedRecommendation?.prerequisiteStatus).toBe("completed");
    expect(completedRecommendation?.recommendationType).toBe("review");
  });
});

describe("daily question and money journey", () => {
  it("selects a metric-connected daily question when data exists", () => {
    const question = selectDailyQuestion([liveMetric("stablecoin_supply")], lessons);

    expect(question.id).toBe("stablecoin-price");
    expect(question.caution).not.toContain("매수");
  });

  it("falls back to a basic question when related metrics are missing", () => {
    const question = selectDailyQuestion(mockMetrics.map((metric) => ({ ...metric, dataStatus: "missing" as const })), lessons);

    expect(question.id).toBe("basic-flow");
  });

  it("keeps the money journey sequence and stablecoin route", () => {
    expect(journeySteps[0].id).toBe("central-bank");
    expect(journeySteps.some((step) => step.id === "stablecoins")).toBe(true);
    expect(journeySteps[journeySteps.length - 1].relatedLessonIds.length).toBeGreaterThan(0);
  });
});

describe("user notes storage", () => {
  it("creates, edits, lists, and deletes notes by target", () => {
    const fakeStorage = storage();
    const first = saveNote(fakeStorage, { id: "note-1", targetType: "lesson", targetId: "what-is-money", body: "첫 메모" }, now);
    expect(first.body).toBe("첫 메모");

    saveNote(fakeStorage, { ...first, body: "수정한 메모" }, now);
    expect(listNotes(fakeStorage, "lesson", "what-is-money")[0].body).toBe("수정한 메모");

    deleteNote(fakeStorage, "note-1");
    expect(readAllNotes(fakeStorage)).toEqual([]);
  });

  it("returns an empty list for broken localStorage JSON", () => {
    expect(readAllNotes(storage("{broken"))).toEqual([]);
  });
});
