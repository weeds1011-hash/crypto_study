import type { NormalizedNewsItem } from "@/server/providers/types";

export function dedupeNews(items: NormalizedNewsItem[]) {
  const sorted = [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const kept: NormalizedNewsItem[] = [];

  for (const item of sorted) {
    const duplicate = kept.some((existing) => {
      if (existing.articleUrl === item.articleUrl) return true;
      const sameHour = Math.abs(new Date(existing.publishedAt).getTime() - new Date(item.publishedAt).getTime()) < 1000 * 60 * 60;
      return sameHour && titleSimilarity(existing.title, item.title) >= 0.72;
    });
    if (!duplicate) kept.push(item);
  }

  return kept;
}

export function titleSimilarity(a: string, b: string) {
  const left = tokens(a);
  const right = tokens(b);
  if (left.size === 0 || right.size === 0) return 0;
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

function tokens(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2),
  );
}
