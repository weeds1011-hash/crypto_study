import type { NewsProvider, NormalizedNewsItem } from "@/server/providers/types";
import { dedupeNews } from "./dedupe";
import { enrichNewsItem } from "./rules";

const defaultFeeds = [
  { source: "CoinDesk", sourceUrl: "https://www.coindesk.com", feedUrl: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { source: "Cointelegraph", sourceUrl: "https://cointelegraph.com", feedUrl: "https://cointelegraph.com/rss" },
];

export class RssNewsProvider implements NewsProvider {
  async fetchLatestNews(params: { categories?: string[]; limit?: number }) {
    const limit = params.limit ?? 8;
    const feeds = parseFeedsFromEnv();
    const settled = await Promise.allSettled(feeds.map((feed) => fetchFeed(feed)));
    const items = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
    const filtered = params.categories?.length ? items.filter((item) => params.categories?.includes(item.category)) : items;
    return dedupeNews(filtered).slice(0, limit);
  }
}

function parseFeedsFromEnv() {
  const raw = process.env.NEWS_RSS_FEEDS;
  if (!raw) return defaultFeeds;
  return raw.split(",").map((feedUrl, index) => ({
    source: `RSS ${index + 1}`,
    sourceUrl: feedUrl.trim(),
    feedUrl: feedUrl.trim(),
  }));
}

async function fetchFeed(feed: { source: string; sourceUrl: string; feedUrl: string }): Promise<NormalizedNewsItem[]> {
  const response = await fetch(feed.feedUrl, { next: { revalidate: 600 } });
  if (!response.ok) throw new Error(`${feed.source} RSS failed`);
  const xml = await response.text();
  return parseRss(xml, feed);
}

export function parseRss(xml: string, feed: { source: string; sourceUrl: string }): NormalizedNewsItem[] {
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  return itemMatches.map((rawItem, index) => {
    const title = clean(readTag(rawItem, "title") ?? "제목 없음");
    const articleUrl = clean(readTag(rawItem, "link") ?? `${feed.sourceUrl}#${index}`);
    const publishedAt = normalizeDate(readTag(rawItem, "pubDate") ?? readTag(rawItem, "dc:date"));
    const summary = clean(readTag(rawItem, "description") ?? "");
    return enrichNewsItem({
      id: `${feed.source.toLowerCase()}-${hash(`${title}-${articleUrl}`)}`,
      title,
      source: feed.source,
      sourceUrl: feed.sourceUrl,
      articleUrl,
      publishedAt,
      summary: summary.slice(0, 240),
      dataStatus: "live",
    });
  });
}

function readTag(xml: string, tag: string) {
  const escaped = tag.replace(":", "\\:");
  const match = xml.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return match?.[1];
}

function clean(value: string) {
  return value
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .trim();
}

function normalizeDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function hash(value: string) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) >>> 0;
  }
  return result.toString(36);
}
