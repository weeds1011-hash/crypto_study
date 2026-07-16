import Link from "next/link";
import { chainDefinitions, metricDefinitionById, metricDefinitions } from "@/features/onchain/definitions";
import type { ChainMetricSnapshot, DataResponseMeta } from "@/server/providers/types";

export function ChainComparison({ metrics, meta }: { metrics: ChainMetricSnapshot[]; meta: DataResponseMeta }) {
  const metricsByChain = new Map<string, Map<string, ChainMetricSnapshot>>();
  for (const chain of chainDefinitions) {
    metricsByChain.set(chain.id, new Map(metrics.filter((metric) => metric.chainId === chain.id).map((metric) => [metric.metricId, metric])));
  }

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-forest">Chain Comparison</p>
          <h2 className="mt-2 text-3xl font-black text-ink">Bitcoin · Ethereum · Solana 비교</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            체인마다 거래 구조가 다르므로 활성 주소나 거래 수를 실제 사용자 수 또는 경제 규모로 단정하지 않습니다.
          </p>
        </div>
        <p className="rounded-md bg-paper px-3 py-2 text-xs font-bold text-muted">
          출처: {meta.source} · 갱신: {new Date(meta.fetchedAt).toLocaleString("ko-KR")} · {meta.stale ? "stale" : meta.requestStatus}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <caption className="sr-only">체인별 온체인 지표 비교표</caption>
          <thead>
            <tr className="border-b border-line text-left">
              <th className="p-3 font-black text-ink">지표</th>
              {chainDefinitions.map((chain) => (
                <th key={chain.id} className="p-3 font-black text-ink">
                  <Link href={`/coins/${chain.symbol.toLowerCase()}`} className="text-marine">
                    {chain.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricDefinitions.map((definition) => (
              <tr key={definition.id} className="border-b border-line align-top">
                <th className="p-3 text-left font-black text-ink">
                  {definition.name}
                  <p className="mt-1 text-xs font-bold leading-5 text-muted">{definition.description}</p>
                </th>
                {chainDefinitions.map((chain) => {
                  const metric = metricsByChain.get(chain.id)?.get(definition.id);
                  return (
                    <td key={`${chain.id}-${definition.id}`} className="p-3">
                      <MetricCell metric={metric} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3" aria-label="TVL 비교 막대 차트">
        {chainDefinitions.map((chain) => {
          const tvl = metricsByChain.get(chain.id)?.get("tvl");
          const value = tvl?.value ?? 0;
          const max = Math.max(...chainDefinitions.map((item) => metricsByChain.get(item.id)?.get("tvl")?.value ?? 0), 1);
          return (
            <div key={chain.id} className="rounded-md border border-line bg-paper p-4">
              <p className="font-black text-ink">{chain.name} TVL</p>
              <div className="mt-3 h-3 rounded-full bg-line">
                <div className="h-3 rounded-full bg-forest" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} />
              </div>
              <p className="mt-2 text-sm font-bold text-muted">{formatValue(tvl)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MetricCell({ metric }: { metric?: ChainMetricSnapshot }) {
  if (!metric || metric.value == null) {
    return (
      <div>
        <p className="font-black text-muted">데이터 없음</p>
        <p className="mt-1 text-xs font-bold text-muted">상태: missing</p>
      </div>
    );
  }
  return (
    <div>
      <p className="font-black text-ink">{formatValue(metric)}</p>
      <p className="mt-1 text-xs font-bold text-muted">
        상태: {metric.dataStatus} · 신뢰도 {metric.confidence}
      </p>
      <p className="mt-1 text-xs font-bold text-muted">출처: {metric.sourceId}</p>
    </div>
  );
}

function formatValue(metric?: ChainMetricSnapshot) {
  if (!metric || metric.value == null) return "데이터 없음";
  return `${metric.value.toLocaleString("ko-KR")} ${metricDefinitionById(metric.metricId)?.unit ?? metric.unit}`;
}
