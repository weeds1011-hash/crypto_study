import { MetricCard } from "@/components/dashboard/MetricCard";
import { getDashboardData } from "@/features/market-data/service";

export default async function MarketsPage() {
  const dashboard = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs font-black uppercase text-forest">Markets</p>
      <h2 className="mt-2 text-4xl font-black text-ink">시장 분석</h2>
      <p className="mt-4 max-w-3xl leading-7 text-muted">
        핵심 지표를 같은 카드 구조로 보고, 샘플과 실제 데이터 출처를 분리해서 표시합니다.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboard.metrics.map((metric) => (
          <MetricCard key={metric.metricId} metric={metric} />
        ))}
      </div>
    </main>
  );
}
