import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsConnectionPanel } from "@/components/dashboard/NewsConnectionPanel";
import { OnchainInsightCard } from "@/components/onchain/OnchainInsightCard";
import { WatchlistPanel } from "@/components/watchlist/WatchlistPanel";
import { lessons } from "@/content/lessons/seed";
import { coinProfiles, profileBySymbol } from "@/features/onchain/coin-profiles";
import { metricDefinitionById } from "@/features/onchain/definitions";
import { siteUrl } from "@/config/routes";
import { getLatestNews } from "@/server/services/news-service";
import { getChainInsight } from "@/server/services/onchain-service";

export function generateStaticParams() {
  return coinProfiles.map((profile) => ({ symbol: profile.symbol }));
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  const profile = profileBySymbol(symbol);
  if (!profile) {
    return {
      title: "코인 정보를 찾을 수 없습니다",
      robots: { index: false, follow: false },
    };
  }

  const title = `${profile.name} 상세 분석 | Crypto Study`;
  const description = `${profile.name}의 공급 구조, 네트워크 활동, 위험과 한계를 학습 관점으로 정리합니다.`;
  return {
    title,
    description,
    alternates: { canonical: `/coins/${profile.symbol}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/coins/${profile.symbol}`,
      type: "article",
      siteName: "Crypto Study",
      locale: "ko_KR",
    },
  };
}

export default async function CoinDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const profile = profileBySymbol(symbol);
  if (!profile) notFound();

  const [{ insight, metrics, meta }, news] = await Promise.all([getChainInsight(profile.chainId), getLatestNews(3)]);
  const coinCategory = profile.symbol === "btc" ? "bitcoin" : profile.symbol === "eth" ? "ethereum" : undefined;
  const relatedNews = news.items.filter((item) => item.category === coinCategory || item.relatedLessonIds.some((slug) => profile.relatedLessons.includes(slug))).slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="rounded-lg border border-line bg-panel p-6 shadow-sm">
        <p className="text-xs font-black uppercase text-forest">Coin Detail</p>
        <h1 className="mt-2 text-4xl font-black text-ink">{profile.name}</h1>
        <p className="mt-3 text-lg font-black leading-8 text-ink">{profile.oneLine}</p>
        <p className="mt-3 text-xs font-bold text-muted">
          온체인 출처: {meta.source} · 갱신: {new Date(meta.fetchedAt).toLocaleString("ko-KR")} · 상태: {meta.requestStatus}
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <TextBlock title="무엇을 해결하는가" body={profile.problem} />
        <TextBlock title="가치가 발생하는 구조" body={profile.valueStructure} />
        <TextBlock title="토큰 또는 코인의 역할" body={profile.tokenRole} />
        <TextBlock title="공급 구조" body={profile.supplyStructure} />
        <TextBlock title="네트워크 활동" body={profile.networkActivity} />
        <TextBlock title="현재 시장 위치" body={profile.marketPosition} />
      </div>

      <OnchainInsightCard insight={insight} />

      <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
        <h2 className="text-2xl font-black text-ink">체인 지표와 데이터 출처</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {metrics.map((metric) => (
            <article key={`${metric.chainId}-${metric.metricId}`} className="rounded-md border border-line bg-paper p-4">
              <h3 className="font-black text-ink">{metricDefinitionById(metric.metricId)?.name ?? metric.metricId}</h3>
              <p className="mt-2 text-sm font-bold text-muted">{metric.value == null ? "데이터 없음" : `${metric.value.toLocaleString("ko-KR")} ${metric.unit}`}</p>
              <p className="mt-2 text-xs font-bold text-muted">
                상태: {metric.dataStatus} · 출처: {metric.sourceId} · 갱신: {new Date(metric.updatedAt).toLocaleString("ko-KR")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ListBlock title="경쟁 프로젝트" items={profile.competitors} />
        <ListBlock title="주요 위험" items={profile.risks} />
      </section>

      <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
        <h2 className="text-2xl font-black text-ink">관련 학습</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.relatedLessons.map((slug) => {
            const lesson = lessons.find((item) => item.slug === slug);
            return lesson ? (
              <Link key={slug} href={`/learn/${slug}`} className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                {lesson.title}
              </Link>
            ) : null;
          })}
        </div>
      </section>

      <NewsConnectionPanel items={relatedNews.length > 0 ? relatedNews : news.items} meta={news.meta} />
      <WatchlistPanel />
    </main>
  );
}

function TextBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
    </section>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
