import type { DataResponseMeta } from "@/server/providers/types";

interface CacheEntry<T> {
  value: T;
  fetchedAt: string;
  expiresAt: number;
  source: string;
}

const store = new Map<string, CacheEntry<unknown>>();

export async function cached<T>(key: string, source: string, ttlMs: number, fetcher: () => Promise<T>): Promise<{ data: T; meta: DataResponseMeta }> {
  const now = Date.now();
  const entry = store.get(key) as CacheEntry<T> | undefined;

  if (entry && entry.expiresAt > now) {
    return {
      data: entry.value,
      meta: {
        source,
        fetchedAt: entry.fetchedAt,
        cachedAt: new Date().toISOString(),
        stale: false,
        requestStatus: "success",
      },
    };
  }

  try {
    const data = await fetcher();
    const fetchedAt = new Date().toISOString();
    store.set(key, { value: data, fetchedAt, expiresAt: now + ttlMs, source });
    return {
      data,
      meta: { source, fetchedAt, stale: false, requestStatus: "success" },
    };
  } catch {
    if (entry) {
      return {
        data: entry.value,
        meta: {
          source,
          fetchedAt: entry.fetchedAt,
          cachedAt: new Date().toISOString(),
          stale: true,
          requestStatus: "partial",
        },
      };
    }
    throw new Error(`${source} request failed and no cache is available`);
  }
}

export function clearMemoryCache() {
  store.clear();
}
