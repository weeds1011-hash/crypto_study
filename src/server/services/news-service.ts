import { placeholderNews } from "@/features/market-news/news.seed";
import { cached } from "@/server/cache/memory-cache";
import { RssNewsProvider } from "@/server/providers/news/rss-provider";
import type { DataResponseMeta, NormalizedNewsItem } from "@/server/providers/types";

export interface NewsServiceResult {
  items: NormalizedNewsItem[];
  meta: DataResponseMeta;
}

export async function getLatestNews(limit = 6): Promise<NewsServiceResult> {
  const provider = new RssNewsProvider();
  try {
    const result = await cached(`news:${limit}`, "rss-news", 1000 * 60 * 10, async () => provider.fetchLatestNews({ limit }));
    return { items: result.data, meta: result.meta };
  } catch {
    return {
      items: placeholderNews.map((item) => ({
        id: item.id,
        title: item.title,
        source: item.source,
        sourceUrl: "#",
        articleUrl: item.url,
        publishedAt: item.publishedAt,
        category: item.category,
        summary: item.summary,
        relatedMetricIds: item.relatedMetricIds,
        relatedLessonIds: item.relatedLessonIds,
        impactPath: item.impactPath ?? [],
        dataStatus: "missing",
      })),
      meta: { source: "rss-news", fetchedAt: new Date().toISOString(), stale: false, requestStatus: "failed" },
    };
  }
}
