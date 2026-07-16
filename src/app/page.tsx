import { MiniFlowMap } from "@/components/flow-map/MiniFlowMap";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LessonRail } from "@/components/learning/LessonRail";
import { getDashboardData } from "@/features/market-data/service";

export default async function HomePage() {
  const dashboard = await getDashboardData();
  const modeLabel = {
    mock: "샘플 데이터 모드",
    mixed: "혼합 데이터 모드",
    live: "실제 데이터 모드",
  }[dashboard.mode];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <section className="grid min-h-[520px] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex rounded-md border border-line bg-panel px-3 py-2 text-sm font-black text-marine">
            {modeLabel}
          </span>
          <h2 className="mt-5 max-w-4xl text-5xl font-black leading-[1.04] tracking-normal text-ink md:text-7xl">
            암호화폐를 가격표가 아니라 돈의 이동 경로로 공부합니다.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{dashboard.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#market" className="rounded-md bg-ink px-5 py-3 font-black text-white">
              오늘의 시장 보기
            </a>
            <a href="#learn" className="rounded-md border border-line bg-panel px-5 py-3 font-black text-ink">
              공부 목차 보기
            </a>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-5 shadow-calm">
          <p className="text-xs font-black uppercase text-forest">Today Brief</p>
          <h3 className="mt-2 text-3xl font-black text-ink">오늘의 시장 요약</h3>
          <p className="mt-4 leading-7 text-muted">
            거시경제, 스테이블코인, DeFi TVL, 비트코인 도미넌스를 함께 보고 자금 유입·유출 가능성을 추정합니다.
            화면의 모든 판단은 근거와 반대 신호를 같이 표시합니다.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-md bg-paper p-4">
              <dt className="text-sm font-bold text-muted">마지막 갱신</dt>
              <dd className="mt-1 font-black">{new Date(dashboard.updatedAt).toLocaleString("ko-KR")}</dd>
            </div>
            <div className="rounded-md bg-paper p-4">
              <dt className="text-sm font-bold text-muted">데이터 상태</dt>
              <dd className="mt-1 font-black">{modeLabel}</dd>
            </div>
          </dl>
          {dashboard.dataWarnings.length ? (
            <div className="mt-5 rounded-md border border-amberline bg-[#fff8e8] p-4 text-sm font-bold leading-6 text-ink">
              {dashboard.dataWarnings.join(" ")}
            </div>
          ) : null}
        </div>
      </section>

      <section id="market" className="py-10">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase text-forest">Market Cards</p>
            <h2 className="text-3xl font-black text-ink md:text-4xl">핵심 시장 카드</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted">
            숫자가 없을 때 0으로 표시하지 않고, 샘플과 실제 데이터를 명확히 구분합니다.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.metrics.map((metric) => (
            <MetricCard key={metric.metricId} metric={metric} />
          ))}
        </div>
      </section>

      <section id="flow" className="py-10">
        <div className="mb-5">
          <p className="text-xs font-black uppercase text-forest">Money Flow Engine</p>
          <h2 className="text-3xl font-black text-ink md:text-4xl">돈의 흐름 미니맵</h2>
        </div>
        <MiniFlowMap signals={dashboard.flowSignals} />
      </section>

      <section id="learn" className="py-10">
        <div className="mb-5">
          <p className="text-xs font-black uppercase text-forest">Learning Content</p>
          <h2 className="text-3xl font-black text-ink md:text-4xl">오늘 연결해서 공부할 개념</h2>
        </div>
        <LessonRail />
      </section>
    </main>
  );
}
