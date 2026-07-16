import type { MarketBrief } from "@/features/market-brief/market-brief.types";

const confidenceLabel = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export function MarketBriefCard({ brief }: { brief: MarketBrief }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-calm" aria-label="오늘의 시장 해설">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-forest">Market Brief</p>
          <h2 className="mt-2 text-3xl font-black text-ink">오늘의 시장 해설</h2>
        </div>
        <span className="rounded-md border border-line bg-paper px-3 py-2 text-sm font-black text-muted">
          {brief.generationMode === "rule" ? "규칙 기반" : "AI 보조"} · 신뢰도 {confidenceLabel[brief.confidence]}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-black leading-8 text-ink">{brief.headline}</h3>
      <ul className="mt-4 grid gap-3">
        {brief.summary.map((item) => (
          <li key={item} className="rounded-md bg-paper p-4 text-sm font-bold leading-6 text-muted">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <InfoList title="주의 또는 반대 신호" items={brief.counterSignals.map((signal) => signal.description)} empty="강한 반대 신호가 없더라도 단정하지 않습니다." />
        <InfoList title="아직 모르는 부분" items={brief.unknowns} empty="현재 규칙에서는 추가 불확실성이 표시되지 않았습니다." />
      </div>
      <p className="mt-4 text-xs font-bold text-muted">
        기준 시각: {new Date(brief.generatedAt).toLocaleString("ko-KR")} · 사용 지표: {brief.sourceMetricIds.join(", ")}
      </p>
    </section>
  );
}

function InfoList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="rounded-md border border-line p-4">
      <h3 className="font-black text-ink">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {(items.length > 0 ? items : [empty]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
