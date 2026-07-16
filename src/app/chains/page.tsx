import { ChainComparison } from "@/components/onchain/ChainComparison";
import { OnchainInsightCard } from "@/components/onchain/OnchainInsightCard";
import { WatchlistPanel } from "@/components/watchlist/WatchlistPanel";
import { chainDefinitions } from "@/features/onchain/definitions";
import { buildOnchainInsight } from "@/features/onchain/insights";
import { getChainMetrics } from "@/server/services/onchain-service";
import { chainsMetadata } from "./metadata";

export const metadata = chainsMetadata;

export default async function ChainsPage() {
  const result = await getChainMetrics();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-8">
        <p className="text-xs font-black uppercase text-forest">Onchain Data</p>
        <h1 className="mt-2 text-4xl font-black text-ink">체인별 자금 흐름 비교</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          Bitcoin, Ethereum, Solana의 온체인 지표를 같은 표에서 비교합니다. 연결되지 않은 지표는 숨기지 않고 데이터 없음으로 표시합니다.
        </p>
      </section>
      <div className="space-y-8">
        <ChainComparison metrics={result.metrics} meta={result.meta} />
        <div className="grid gap-5 lg:grid-cols-3">
          {chainDefinitions.map((chain) => (
            <OnchainInsightCard key={chain.id} insight={buildOnchainInsight(chain.id, result.metrics.filter((metric) => metric.chainId === chain.id))} />
          ))}
        </div>
        <WatchlistPanel />
      </div>
    </main>
  );
}
