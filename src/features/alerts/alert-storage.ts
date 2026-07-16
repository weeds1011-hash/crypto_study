export interface AlertRule {
  id: string;
  targetType: "metric" | "coin" | "chain" | "news";
  targetId: string;
  condition: "above" | "below" | "change_up" | "change_down" | "new_item";
  threshold?: number;
  period?: "24h" | "7d" | "30d";
  enabled: boolean;
}

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

const key = "crypto-study:alert-rules";

export function listAlertRules(storage: StorageLike): AlertRule[] {
  const raw = storage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAlertRule);
  } catch {
    return [];
  }
}

export function saveAlertRule(storage: StorageLike, rule: AlertRule) {
  const next = listAlertRules(storage).filter((item) => item.id !== rule.id).concat(rule);
  storage.setItem(key, JSON.stringify(next));
  return next;
}

export function deleteAlertRule(storage: StorageLike, id: string) {
  const next = listAlertRules(storage).filter((item) => item.id !== id);
  storage.setItem(key, JSON.stringify(next));
  return next;
}

function isAlertRule(value: unknown): value is AlertRule {
  if (typeof value !== "object" || value == null) return false;
  const rule = value as Partial<AlertRule>;
  return typeof rule.id === "string" && typeof rule.targetType === "string" && typeof rule.targetId === "string" && typeof rule.condition === "string" && typeof rule.enabled === "boolean";
}
