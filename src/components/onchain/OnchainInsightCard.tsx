import type { OnchainInsight } from "@/features/onchain/insights";

export function OnchainInsightCard({ insight }: { insight: OnchainInsight }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-forest">Onchain Insight</p>
      <h2 className="mt-2 text-3xl font-black text-ink">{insight.title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">{insight.summary}</p>
      <p className="mt-2 text-xs font-black text-muted">신뢰도: {insight.confidence}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <SignalList title="가능한 긍정 신호" items={insight.positiveSignals.map((signal) => signal.explanation)} />
        <SignalList title="주의 또는 약한 신호" items={insight.negativeSignals.map((signal) => signal.explanation)} />
        <SignalList title="중립 신호" items={insight.neutralSignals.map((signal) => signal.explanation)} />
        <SignalList title="한계와 미확인" items={insight.unknowns} />
      </div>
    </section>
  );
}

function SignalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-line bg-paper p-4">
      <h3 className="font-black text-ink">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {(items.length > 0 ? items : ["현재 표시할 신호가 없습니다."]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
