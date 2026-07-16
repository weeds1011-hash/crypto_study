export type WatchTargetType = "coin" | "chain" | "metric" | "lesson" | "news-category";

export interface WatchItem {
  id: string;
  targetType: WatchTargetType;
  targetId: string;
  label: string;
  createdAt: string;
}

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

const key = "crypto-study:watchlist";

export function listWatchItems(storage: StorageLike): WatchItem[] {
  const raw = storage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWatchItem);
  } catch {
    return [];
  }
}

export function addWatchItem(storage: StorageLike, item: Omit<WatchItem, "id" | "createdAt">, now = new Date().toISOString()) {
  const items = listWatchItems(storage);
  const exists = items.some((existing) => existing.targetType === item.targetType && existing.targetId === item.targetId);
  if (exists) return items;
  const next = items.concat({ ...item, id: `${item.targetType}:${item.targetId}`, createdAt: now });
  storage.setItem(key, JSON.stringify(next));
  return next;
}

export function removeWatchItem(storage: StorageLike, id: string) {
  const next = listWatchItems(storage).filter((item) => item.id !== id);
  storage.setItem(key, JSON.stringify(next));
  return next;
}

function isWatchItem(value: unknown): value is WatchItem {
  if (typeof value !== "object" || value == null) return false;
  const item = value as Partial<WatchItem>;
  return typeof item.id === "string" && typeof item.targetType === "string" && typeof item.targetId === "string" && typeof item.label === "string" && typeof item.createdAt === "string";
}
