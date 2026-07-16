import type { NewsCategory, NewsImpactLink, NormalizedNewsItem } from "@/server/providers/types";

const rules: Array<{
  category: NewsCategory;
  keywords: string[];
  impactPath: string[];
  relatedMetricIds: string[];
  relatedLessonIds: string[];
  explanation: string;
  relationType: NewsImpactLink["relationType"];
}> = [
  {
    category: "macro",
    keywords: ["cpi", "inflation", "fomc", "fed", "rate", "powell", "dollar", "liquidity"],
    impactPath: ["물가·연준", "금리 기대", "달러", "위험자산", "암호화폐"],
    relatedMetricIds: ["fed_rate", "global_liquidity", "crypto_market_cap"],
    relatedLessonIds: ["what-is-money", "money-flow"],
    explanation: "이 뉴스는 물가와 금리 기대를 통해 위험자산 심리에 영향을 줄 수 있습니다.",
    relationType: "indirect",
  },
  {
    category: "bitcoin",
    keywords: ["bitcoin", "btc", "spot etf", "halving"],
    impactPath: ["기관 수요", "비트코인", "도미넌스", "암호화폐 시장"],
    relatedMetricIds: ["btc_dominance", "crypto_market_cap"],
    relatedLessonIds: ["bitcoin-ethereum", "money-flow"],
    explanation: "비트코인 관련 뉴스는 시장 기준 자산의 관심도와 자금 집중도를 살펴보는 맥락이 될 수 있습니다.",
    relationType: "contextual",
  },
  {
    category: "ethereum",
    keywords: ["ethereum", "ether", "eth", "staking", "gas"],
    impactPath: ["이더리움", "수수료", "DeFi", "온체인 활동"],
    relatedMetricIds: ["defi_tvl"],
    relatedLessonIds: ["bitcoin-ethereum", "tvl"],
    explanation: "이더리움 뉴스는 DeFi 활동과 네트워크 사용 비용을 함께 확인할 이유가 될 수 있습니다.",
    relationType: "contextual",
  },
  {
    category: "stablecoin",
    keywords: ["stablecoin", "usdt", "usdc", "tether", "circle"],
    impactPath: ["스테이블코인", "거래소 유동성", "암호화폐 시장"],
    relatedMetricIds: ["stablecoin_supply", "crypto_market_cap"],
    relatedLessonIds: ["stablecoins", "money-flow"],
    explanation: "스테이블코인 뉴스는 시장 안의 현금성 유동성과 규제 환경을 점검할 단서가 될 수 있습니다.",
    relationType: "direct",
  },
  {
    category: "defi",
    keywords: ["defi", "dex", "tvl", "lending", "aave", "uniswap"],
    impactPath: ["DeFi", "TVL", "DEX 거래량", "체인 활동"],
    relatedMetricIds: ["defi_tvl"],
    relatedLessonIds: ["tvl", "onchain-risk"],
    explanation: "DeFi 뉴스는 예치 자금, 거래 활동, 스마트 계약 위험을 함께 살펴보게 합니다.",
    relationType: "direct",
  },
  {
    category: "security",
    keywords: ["hack", "exploit", "breach", "phishing", "bridge"],
    impactPath: ["보안 이벤트", "신뢰", "거래소·체인 유입출", "위험 회피"],
    relatedMetricIds: ["defi_tvl", "stablecoin_supply"],
    relatedLessonIds: ["onchain-risk"],
    explanation: "보안 뉴스는 자금 이동과 신뢰도에 영향을 줄 수 있지만 실제 원인은 온체인 데이터로 추가 확인해야 합니다.",
    relationType: "indirect",
  },
  {
    category: "exchange",
    keywords: ["exchange", "binance", "coinbase", "kraken", "upbit"],
    impactPath: ["거래소", "유동성", "입출금", "시장 접근성"],
    relatedMetricIds: ["stablecoin_supply", "crypto_market_cap"],
    relatedLessonIds: ["stablecoins", "money-flow"],
    explanation: "거래소 뉴스는 유동성과 접근성 경로를 통해 시장 심리에 영향을 줄 수 있습니다.",
    relationType: "contextual",
  },
  {
    category: "regulation",
    keywords: ["sec", "regulation", "lawsuit", "ban", "policy"],
    impactPath: ["규제", "시장 접근성", "유동성", "암호화폐 시장"],
    relatedMetricIds: ["crypto_market_cap", "stablecoin_supply"],
    relatedLessonIds: ["what-is-crypto", "onchain-risk"],
    explanation: "규제 뉴스는 시장 참여 조건과 유동성 경로에 영향을 줄 수 있습니다.",
    relationType: "contextual",
  },
];

export function classifyNews(title: string, summary = "") {
  const text = `${title} ${summary}`.toLowerCase();
  return rules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword))) ?? rules[0];
}

export function linkNewsImpact(item: Pick<NormalizedNewsItem, "id" | "title" | "summary">): NewsImpactLink {
  const rule = classifyNews(item.title, item.summary);
  return {
    newsId: item.id,
    impactPath: rule.impactPath,
    relatedMetricIds: rule.relatedMetricIds,
    explanation: rule.explanation,
    confidence: rule.relationType === "direct" ? "medium" : "low",
    relationType: rule.relationType,
  };
}

export function categoryFor(title: string, summary = "") {
  return classifyNews(title, summary).category;
}

export function enrichNewsItem(base: Omit<NormalizedNewsItem, "category" | "relatedMetricIds" | "relatedLessonIds" | "impactPath">): NormalizedNewsItem {
  const rule = classifyNews(base.title, base.summary);
  return {
    ...base,
    category: rule.category,
    relatedMetricIds: rule.relatedMetricIds,
    relatedLessonIds: rule.relatedLessonIds,
    impactPath: rule.impactPath,
  };
}
