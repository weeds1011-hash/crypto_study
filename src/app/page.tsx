import { MetricCard } from "@/components/dashboard/MetricCard";
import { MiniFlowMap } from "@/components/flow-map/MiniFlowMap";
import { LearningProgress } from "@/components/learning/LearningProgress";
import { LessonRail } from "@/components/learning/LessonRail";
import { lessons } from "@/content/lessons/seed";
import { getDashboardData } from "@/features/market-data/service";
import { metricById, pickStudyRecommendation, summarizeMarket } from "@/lib/dashboard/insights";

const modeLabel = {
  mock: "샘플 데이터",
  mixed: "혼합 데이터",
  live: "실데이터",
};

export default async function HomePage() {
  const dashboard = await getDashboardData();
  const marketSummary = summarizeMarket(dashboard.flowSignals);
  const study = pickStudyRecommendation(dashboard.metrics, dashboard.flowSignals);
  const marketCap = metricById(dashboard.metrics, "crypto_market_cap");
  const midMetrics = ["btc_dominance", "stablecoin_supply", "defi_tvl"]
    .map((id) => metricById(dashboard.metrics, id))
    .filter((metric): metric is NonNullable<typeof metric> => metric != null);
  const supportMetrics = ["global_liquidity", "fed_rate"]
    .map((id) => metricById(dashboard.metrics, id))
    .filter((metric): metric is NonNullable<typeof metric> => metric != null);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <section className="grid min-h-[560px] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex rounded-md border border-line bg-panel px-3 py-2 text-sm font-black text-marine">
            Crypto Study Dashboard
          </span>
          <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[1.08] tracking-normal text-ink md:text-6xl">
            오늘 시장은 어떤 상태일까?
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-black leading-8 text-ink">
            돈은 지금 어디로 이동하고 있고, 오늘 무엇을 공부하면 좋을까요?
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            암호화폐를 가격표가 아니라 돈의 이동 경로로 공부합니다. 이 화면은 가격을 맞히는 도구가 아니라, 시장 상태와 데이터 신뢰도와 학습 주제를 함께 보는 학습용 대시보드입니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#flow" className="rounded-md bg-ink px-5 py-3 font-black text-white focus:outline-none focus:ring-2 focus:ring-marine">
              돈의 흐름 보기
            </a>
            <a href="#learn" className="rounded-md border border-line bg-panel px-5 py-3 font-black text-ink focus:outline-none focus:ring-2 focus:ring-marine">
              오늘 공부 시작
            </a>
          </div>
        </div>
        <aside className="rounded-lg border border-line bg-panel p-5 shadow-calm" aria-label="오늘의 요약 상태">
          <p className="text-xs font-black uppercase text-forest">Today Brief</p>
          <h3 className="mt-2 text-3xl font-black text-ink">한눈에 보는 오늘</h3>
          <div className="mt-6 grid gap-3">
            <SummaryTile label="시장 상태" value={marketSummary.status} body={marketSummary.text} />
            <SummaryTile label="데이터 상태" value={modeLabel[dashboard.mode]} body="각 카드에서 실데이터, 샘플, 혼합, 데이터 없음 상태를 따로 확인할 수 있습니다." />
            <SummaryTile label="오늘 추천 학습" value={study.title} body={study.reason} />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-md bg-paper p-4">
              <dt className="text-sm font-bold text-muted">마지막 갱신</dt>
              <dd className="mt-1 font-black">{new Date(dashboard.updatedAt).toLocaleString("ko-KR")}</dd>
            </div>
            <div className="rounded-md bg-paper p-4">
              <dt className="text-sm font-bold text-muted">흐름 신호</dt>
              <dd className="mt-1 font-black">{dashboard.flowSignals.length}개</dd>
            </div>
          </dl>
          {dashboard.dataWarnings.length ? (
            <div className="mt-5 rounded-md border border-amberline bg-[#fff8e8] p-4 text-sm font-bold leading-6 text-ink">
              {dashboard.dataWarnings.join(" ")}
            </div>
          ) : null}
        </aside>
      </section>

      <section id="market" className="py-10">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase text-forest">Market Cards</p>
            <h2 className="text-3xl font-black text-ink md:text-4xl">핵심 시장 카드</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted">
            첫 화면에는 요약을 먼저 보여주고, 각 카드의 주의사항과 출처는 자세히 보기에서 확인합니다.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketCap ? <MetricCard metric={marketCap} size="feature" /> : null}
          {midMetrics.map((metric) => (
            <MetricCard key={metric.metricId} metric={metric} size="standard" />
          ))}
          {supportMetrics.map((metric) => (
            <MetricCard key={metric.metricId} metric={metric} size="compact" />
          ))}
        </div>
      </section>

      <section id="flow" className="py-10">
        <div className="mb-5 grid gap-3 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase text-forest">Money Flow Engine</p>
            <h2 className="text-3xl font-black text-ink md:text-4xl">돈의 흐름 지도</h2>
          </div>
          <p className="rounded-lg border border-line bg-panel p-4 text-sm font-bold leading-6 text-muted">
            {marketSummary.text}
          </p>
        </div>
        <MiniFlowMap signals={dashboard.flowSignals} />
      </section>

      <section id="learn" className="space-y-5 py-10">
        <LearningProgress totalLessons={lessons.length} />
        <div>
          <p className="text-xs font-black uppercase text-forest">Learning Content</p>
          <h2 className="text-3xl font-black text-ink md:text-4xl">오늘 공부할 개념</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            시장 카드와 돈의 흐름에서 자주 마주치는 개념을 질문형 카드로 정리했습니다.
          </p>
        </div>
        <LessonRail />
      </section>
    </main>
  );
}

function SummaryTile({ label, value, body }: { label: string; value: string; body: string }) {
  return (
    <article className="rounded-md border border-line bg-paper p-4">
      <p className="text-sm font-black text-forest">{label}</p>
      <h4 className="mt-1 text-lg font-black text-ink">{value}</h4>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </article>
  );
}
