export function formatMetricValue(value: number | null, unit: string) {
  if (value === null) return "데이터 없음";
  const formatted = new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: Math.abs(value) >= 100 ? 1 : 2,
  }).format(value);
  return `${formatted} ${unit}`;
}

export function formatChange(value?: number | null) {
  if (value === null || value === undefined) return "데이터 없음";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function changeTone(value?: number | null) {
  if (value === null || value === undefined) return "text-muted";
  if (value > 0) return "text-forest";
  if (value < 0) return "text-danger";
  return "text-muted";
}
