import Link from "next/link";
import type { MetricSnapshot } from "@/types";
import { formatChange, formatMetricValue } from "@/lib/formatters/numbers";

const statusLabel = {
  live: "실데이터",
  mock: "샘플",
  mixed: "혼합",
  missing: "데이터 없음",
};

export function MarketMetricLinks({ metrics }: { metrics: MetricSnapshot[] }) {
  if (metrics.length === 0) {
    return (
      <section className="mt-8 rounded-md border border-line p-4">
        <h3 className="font-black text-ink">현재 시장과 연결</h3>
        <p className="mt-3 text-sm leading-6 text-muted">이 수업과 직접 연결된 시장 지표가 아직 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-md border border-line p-4">
      <h3 className="font-black text-ink">현재 시장과 연결</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {metrics.map((metric) => (
          <article key={metric.metricId} className="rounded-md bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-black text-ink">{metric.label}</h4>
              <span className="rounded-md border border-line bg-panel px-2 py-1 text-xs font-black text-muted">{statusLabel[metric.dataStatus]}</span>
            </div>
            <p className="mt-2 text-2xl font-black text-ink">{formatMetricValue(metric.value, metric.unit)}</p>
            <p className="mt-2 text-sm font-bold text-muted">7일 변화율: {formatChange(metric.change7d)}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{metric.interpretation}</p>
            <Link href="/markets" className="mt-3 inline-flex text-sm font-black text-marine">
              시장 카드에서 보기
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
