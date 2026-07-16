import { MiniFlowMap } from "@/components/flow-map/MiniFlowMap";
import { getDashboardData } from "@/features/market-data/service";

export default async function MoneyFlowPage() {
  const dashboard = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs font-black uppercase text-forest">Money Flow</p>
      <h2 className="mt-2 text-4xl font-black text-ink">돈의 흐름 엔진</h2>
      <p className="mt-4 max-w-3xl leading-7 text-muted">
        자금 흐름은 확정 사실이 아니라 여러 지표를 조합한 추정입니다. 각 연결선은 판단 근거와 반대 신호를 함께 보여줍니다.
      </p>
      <div className="mt-8">
        <MiniFlowMap signals={dashboard.flowSignals} />
      </div>
    </main>
  );
}
