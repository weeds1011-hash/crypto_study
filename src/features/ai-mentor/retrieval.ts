import { glossaryTerms } from "@/content/glossary/seed";
import { lessons } from "@/content/lessons/seed";
import { coinProfiles } from "@/features/onchain/coin-profiles";
import type { NormalizedNewsItem } from "@/server/providers/types";
import type { GlossaryTerm, MetricSnapshot } from "@/types";
import { buildKnowledgeGraph, relatedNodeIds, type KnowledgeGraph } from "./knowledge-graph";

export interface RetrievalContext {
  graph: KnowledgeGraph;
  metrics: MetricSnapshot[];
  news: NormalizedNewsItem[];
  lessons: typeof lessons;
  terms: GlossaryTerm[];
  coins: typeof coinProfiles;
}

export interface RetrievedContext {
  metrics: MetricSnapshot[];
  metricScores: Record<string, number>;
  news: NormalizedNewsItem[];
  newsScores: Record<string, number>;
  lessons: typeof lessons;
  lessonScores: Record<string, number>;
  terms: GlossaryTerm[];
  coins: typeof coinProfiles;
  graph: KnowledgeGraph;
  hasDirectResults: boolean;
}

const aliases: Record<string, string[]> = {
  btc: ["bitcoin", "비트코인", "btc"],
  eth: ["ethereum", "이더리움", "eth"],
  sol: ["solana", "솔라나", "sol"],
  stablecoin_supply: ["stablecoin", "스테이블코인", "공급", "공급이", "중요해", "스테이블코인 공급", "usdt", "usdc"],
  defi_tvl: ["tvl", "defi", "디파이", "예치"],
  btc_dominance: ["dominance", "도미넌스", "비트코인 비중"],
  fed_rate: ["fed", "fomc", "금리", "연준"],
  global_liquidity: ["liquidity", "유동성", "달러"],
};

const canonicalLessonByToken: Record<string, string> = {
  stablecoin: "stablecoins",
  "스테이블코인": "stablecoins",
  tvl: "tvl",
  defi: "tvl",
  "디파이": "tvl",
  bitcoin: "bitcoin-ethereum",
  "비트코인": "bitcoin-ethereum",
  ethereum: "bitcoin-ethereum",
  "이더리움": "bitcoin-ethereum",
};

export function createRetrievalContext(metrics: MetricSnapshot[], news: NormalizedNewsItem[]): RetrievalContext {
  return {
    graph: buildKnowledgeGraph(metrics, news),
    metrics,
    news,
    lessons,
    terms: glossaryTerms,
    coins: coinProfiles,
  };
}

export function retrieveFromApp(question: string, context: RetrievalContext): RetrievedContext {
  const query = normalize(question);
  const scoredNodes = context.graph.nodes
    .map((node) => ({ node, score: scoreText(query, `${node.label} ${node.summary} ${aliases[node.id]?.join(" ") ?? ""}`) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  const expandedIds = new Set(scoredNodes.map((item) => item.node.id));
  for (const item of scoredNodes.slice(0, 5)) {
    for (const id of relatedNodeIds(context.graph, item.node.id)) expandedIds.add(id);
  }

  const terms = context.terms
    .map((term) => ({ term, score: scoreText(query, `${term.term} ${term.englishTerm ?? ""} ${term.oneLineDefinition}`) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.term);

  const metricCandidates = context.metrics
    .map((metric) => ({
      metric,
      score: (expandedIds.has(metric.metricId) ? 1 : 0) + scoreText(query, `${metric.label} ${metric.metricId} ${aliases[metric.metricId]?.join(" ") ?? ""}`),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  const newsCandidates = context.news
    .map((item) => ({
      item,
      score: Math.max(expandedIds.has(item.id) ? 1 : 0, item.relatedMetricIds.some((id) => expandedIds.has(id)) ? 1 : 0, scoreText(query, `${item.title} ${item.summary ?? ""} ${item.category}`)),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  const lessonCandidates = context.lessons
    .map((lesson) => ({
      lesson,
      score:
        (expandedIds.has(lesson.slug) ? 3 : 0) +
        (lesson.relatedMetricIds.some((id) => expandedIds.has(id)) ? 2 : 0) +
        scoreText(query, `${lesson.title} ${lesson.summary} ${lesson.relatedTerms.join(" ")} ${lesson.slug}`),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  const metrics = metricCandidates.slice(0, 3).map((item) => item.metric);
  const relatedNews = newsCandidates.slice(0, 3).map((item) => item.item);
  const relatedLessons = withCanonicalLesson(query, lessonCandidates.slice(0, 3).map((item) => item.lesson), context.lessons);

  return {
    graph: context.graph,
    metrics,
    metricScores: Object.fromEntries(metricCandidates.map((item) => [item.metric.metricId, item.score])),
    news: relatedNews,
    newsScores: Object.fromEntries(newsCandidates.map((item) => [item.item.id, item.score])),
    lessons: relatedLessons,
    lessonScores: Object.fromEntries(lessonCandidates.map((item) => [item.lesson.slug, item.score])),
    terms,
    coins: context.coins.filter((coin) => expandedIds.has(coin.symbol) || expandedIds.has(coin.chainId) || scoreText(query, `${coin.name} ${coin.symbol} ${coin.oneLine}`) > 0).slice(0, 3),
    hasDirectResults: metrics.length > 0 || relatedNews.length > 0 || relatedLessons.length > 0 || terms.length > 0,
  };
}

function withCanonicalLesson(query: string, selected: typeof lessons, allLessons: typeof lessons) {
  const canonicalSlug = Object.entries(canonicalLessonByToken).find(([token]) => query.includes(token))?.[1];
  if (!canonicalSlug || selected.some((lesson) => lesson.slug === canonicalSlug)) return selected;
  const canonical = allLessons.find((lesson) => lesson.slug === canonicalSlug);
  if (!canonical) return selected;
  return [...selected.slice(0, 2), canonical];
}

function scoreText(query: string, text: string) {
  const tokens = tokenize(query);
  const haystack = normalize(text);
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function tokenize(value: string) {
  return normalize(value)
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9가-힣.\s]/g, " ");
}
