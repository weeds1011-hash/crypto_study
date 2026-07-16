import type { MarketNewsItem } from "./news.types";

export const placeholderNews: MarketNewsItem[] = [
  {
    id: "news-placeholder-cpi",
    title: "뉴스 연결 준비 중: 미국 CPI 발표",
    source: "뉴스 API 미연결",
    publishedAt: new Date().toISOString(),
    url: "#",
    category: "macro",
    relatedMetricIds: ["fed_rate", "global_liquidity"],
    relatedLessonIds: ["what-is-money", "money-flow"],
    impactPath: ["물가", "금리 기대", "달러", "위험자산", "암호화폐"],
    summary: "향후 뉴스 API를 연결하면 물가와 금리 기대가 암호화폐 시장에 줄 수 있는 영향을 학습 콘텐츠와 연결해 표시합니다.",
    dataStatus: "missing",
  },
];
