import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { navItems, siteUrl, staticRoutes } from "@/config/routes";
import { listAlertRules } from "@/features/alerts/alert-storage";
import { profileBySymbol } from "@/features/onchain/coin-profiles";
import { buildOnchainInsight } from "@/features/onchain/insights";
import { listWatchItems } from "@/features/watchlist/watchlist-storage";
import type { ChainMetricSnapshot } from "@/server/providers/types";

const appDir = join(process.cwd(), "src", "app");

describe("final route QA", () => {
  it("keeps the core learning route files present for rendering", () => {
    const routeFiles = [
      "page.tsx",
      join("learn", "page.tsx"),
      join("glossary", "page.tsx"),
      join("coins", "[symbol]", "page.tsx"),
    ];

    expect(routeFiles.every((file) => existsSync(join(appDir, file)))).toBe(true);
  });

  it("handles invalid coin slugs through profile lookup", () => {
    expect(profileBySymbol("doge")).toBeUndefined();
    expect(profileBySymbol("btc")?.name).toBe("Bitcoin");
  });

  it("provides mobile menu open and close controls", () => {
    const source = readFileSync(join(process.cwd(), "src", "components", "layout", "SiteHeader.tsx"), "utf8");

    expect(source).toContain("메뉴 열기");
    expect(source).toContain("메뉴 닫기");
    expect(source).toContain("aria-expanded");
  });
});

describe("final SEO QA", () => {
  it("publishes canonical routes in sitemap without duplicates", () => {
    const routes = sitemap().map((entry) => entry.url);

    expect(routes).toContain(`${siteUrl}/`);
    expect(routes).toContain(`${siteUrl}/learn`);
    expect(routes).toContain(`${siteUrl}/glossary`);
    expect(routes).toContain(`${siteUrl}/coins/btc`);
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("publishes robots with sitemap location", () => {
    expect(robots().sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });

  it("keeps navigation aligned with the rebuilt category dashboard", () => {
    expect(staticRoutes).toEqual(["/", "/learn", "/glossary"]);

    expect(navItems.map((item) => item.label)).toEqual([
      "분류 대시보드",
      "대분류·소분류",
      "개념 구분",
      "경제 관계",
      "전체 강의",
      "용어사전",
    ]);
  });
});

describe("final data-state QA", () => {
  it("keeps missing onchain data separate from numeric zero", () => {
    const metrics: ChainMetricSnapshot[] = [
      {
        chainId: "bitcoin",
        metricId: "tvl",
        value: 0,
        unit: "B USD",
        change24h: null,
        change7d: null,
        sourceId: "test",
        dataStatus: "live",
        updatedAt: new Date().toISOString(),
        confidence: "medium",
      },
      {
        chainId: "bitcoin",
        metricId: "active_addresses",
        value: null,
        unit: "addresses",
        change24h: null,
        change7d: null,
        sourceId: "test",
        dataStatus: "missing",
        updatedAt: new Date().toISOString(),
        confidence: "low",
      },
    ];
    const insight = buildOnchainInsight("bitcoin", metrics);

    expect(insight.positiveSignals.some((signal) => signal.metricId === "tvl")).toBe(true);
    expect(insight.unknowns.some((item) => item.includes("활성 주소"))).toBe(true);
  });

  it("recovers alert and watchlist storage from invalid JSON", () => {
    const broken = { getItem: () => "{bad", setItem: () => undefined };

    expect(listAlertRules(broken)).toEqual([]);
    expect(listWatchItems(broken)).toEqual([]);
  });
});

