import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteAlertRule, listAlertRules, saveAlertRule } from "@/features/alerts/alert-storage";
import { buildOnchainInsight } from "@/features/onchain/insights";
import { addWatchItem, listWatchItems, removeWatchItem } from "@/features/watchlist/watchlist-storage";
import { cached, clearMemoryCache } from "@/server/cache/memory-cache";
import { dedupeNews, titleSimilarity } from "@/server/providers/news/dedupe";
import { parseRss } from "@/server/providers/news/rss-provider";
import { categoryFor, linkNewsImpact } from "@/server/providers/news/rules";
import type { ChainMetricSnapshot, NormalizedNewsItem } from "@/server/providers/types";

const now = new Date().toISOString();

function storage(initial = "[]") {
  let value = initial;
  return {
    getItem: () => value,
    setItem: (_key: string, nextValue: string) => {
      value = nextValue;
    },
  };
}

function news(id: string, title: string, articleUrl = `https://example.com/${id}`): NormalizedNewsItem {
  return {
    id,
    title,
    source: "Example",
    sourceUrl: "https://example.com",
    articleUrl,
    publishedAt: now,
    category: "macro",
    relatedMetricIds: ["fed_rate"],
    relatedLessonIds: ["money-flow"],
    impactPath: ["물가", "금리 기대"],
    dataStatus: "live",
  };
}

function chainMetric(metricId: string, value: number | null, dataStatus: ChainMetricSnapshot["dataStatus"] = "live"): ChainMetricSnapshot {
  return {
    chainId: "ethereum",
    metricId,
    value,
    unit: "B USD",
    change24h: null,
    change7d: null,
    sourceId: "test",
    dataStatus,
    updatedAt: now,
    confidence: dataStatus === "live" ? "medium" : "low",
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  clearMemoryCache();
});

describe("news provider normalization", () => {
  it("deduplicates by URL and similar title within the same hour", () => {
    const items = dedupeNews([
      news("1", "Bitcoin ETF inflows rise after Fed decision", "https://example.com/a"),
      news("2", "Bitcoin ETF inflows rise following Fed decision", "https://example.com/b"),
      news("3", "Stablecoin regulation bill advances", "https://example.com/c"),
      news("4", "Other copy", "https://example.com/c"),
    ]);

    expect(items.length).toBe(2);
    expect(titleSimilarity("Bitcoin ETF inflows rise", "Bitcoin ETF inflows rise today")).toBeGreaterThan(0.5);
  });

  it("classifies categories and links market metrics without causal wording", () => {
    expect(categoryFor("US CPI inflation cools before FOMC")).toBe("macro");
    expect(categoryFor("Stablecoin regulation bill advances")).toBe("stablecoin");
    const impact = linkNewsImpact({ id: "n1", title: "Exchange hack reported", summary: "" });

    expect(impact.relatedMetricIds.length).toBeGreaterThan(0);
    expect(impact.explanation).not.toContain("때문에 비트코인이 상승");
  });

  it("parses RSS items into normalized live news", () => {
    const xml = `<rss><channel><item><title><![CDATA[Bitcoin ETF update]]></title><link>https://example.com/a</link><pubDate>Tue, 01 Jul 2025 00:00:00 GMT</pubDate><description><![CDATA[Short summary]]></description></item></channel></rss>`;
    const [item] = parseRss(xml, { source: "Example", sourceUrl: "https://example.com" });

    expect(item.title).toBe("Bitcoin ETF update");
    expect(item.dataStatus).toBe("live");
    expect(item.relatedLessonIds).toContain("bitcoin-ethereum");
  });
});

describe("onchain insight", () => {
  it("handles null and missing metrics with explicit unknowns", () => {
    const insight = buildOnchainInsight("ethereum", [chainMetric("tvl", null, "missing")]);

    expect(insight.confidence).toBe("low");
    expect(insight.unknowns[0]).toContain("아직");
  });

  it("creates positive signals with limitations for connected metrics", () => {
    const insight = buildOnchainInsight("ethereum", [chainMetric("tvl", 90), chainMetric("stablecoin_supply", 80)]);

    expect(insight.positiveSignals.length).toBe(2);
    expect(insight.positiveSignals[0].explanation).toContain("다만");
  });
});

describe("personal storage", () => {
  it("adds, deduplicates, and removes watchlist items", () => {
    const fakeStorage = storage();
    addWatchItem(fakeStorage, { targetType: "coin", targetId: "btc", label: "BTC" }, now);
    addWatchItem(fakeStorage, { targetType: "coin", targetId: "btc", label: "BTC" }, now);
    expect(listWatchItems(fakeStorage)).toHaveLength(1);

    removeWatchItem(fakeStorage, "coin:btc");
    expect(listWatchItems(fakeStorage)).toEqual([]);
  });

  it("recovers from broken watchlist localStorage", () => {
    expect(listWatchItems(storage("{bad"))).toEqual([]);
  });

  it("creates and deletes alert rules", () => {
    const fakeStorage = storage();
    const rule = { id: "a1", targetType: "coin" as const, targetId: "btc", condition: "change_up" as const, threshold: 5, period: "24h" as const, enabled: true };
    saveAlertRule(fakeStorage, rule);
    expect(listAlertRules(fakeStorage)[0].targetId).toBe("btc");
    deleteAlertRule(fakeStorage, "a1");
    expect(listAlertRules(fakeStorage)).toEqual([]);
  });
});

describe("provider cache", () => {
  it("deduplicates repeated provider calls during ttl", async () => {
    const fetcher = vi.fn(async () => ["ok"]);
    await cached("same", "test", 1000, fetcher);
    await cached("same", "test", 1000, fetcher);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("uses stale cached data when a later provider call fails", async () => {
    await cached("stale", "test", 1, async () => ["first"]);
    await new Promise((resolve) => setTimeout(resolve, 2));
    const result = await cached<string[]>("stale", "test", 1, async () => {
      throw new Error("failed");
    });

    expect(result.data).toEqual(["first"]);
    expect(result.meta.stale).toBe(true);
  });
});
