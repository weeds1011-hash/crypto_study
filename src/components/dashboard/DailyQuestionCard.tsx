import Link from "next/link";
import type { DailyQuestion } from "@/features/daily-question/questions";
import type { MetricSnapshot } from "@/types";
import { formatMetricValue } from "@/lib/formatters/numbers";

export function DailyQuestionCard({ question, metrics }: { question: DailyQuestion; metrics: MetricSnapshot[] }) {
  const relatedMetrics = metrics.filter((metric) => question.relatedMetricIds.includes(metric.metricId));

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm" aria-label="오늘의 질문">
      <p className="text-xs font-black uppercase text-forest">Daily Question</p>
      <h2 className="mt-2 text-3xl font-black text-ink">오늘의 질문</h2>
      <h3 className="mt-4 text-xl font-black leading-8 text-ink">{question.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{question.shortAnswer}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md bg-paper p-4">
          <h4 className="font-black text-ink">가능한 설명</h4>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-muted">
            {question.explanationBlocks.map((block) => (
              <li key={block}>{block}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md bg-paper p-4">
          <h4 className="font-black text-ink">반대 사례와 주의</h4>
          <p className="mt-2 text-sm leading-6 text-muted">{question.counterExample}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-danger">{question.caution}</p>
        </div>
      </div>
      {relatedMetrics.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {relatedMetrics.map((metric) => (
            <span key={metric.metricId} className="rounded-md border border-line bg-paper px-3 py-2 text-xs font-black text-muted">
              {metric.label}: {formatMetricValue(metric.value, metric.unit)}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {question.relatedLessonIds.map((slug) => (
          <Link key={slug} href={`/learn/${slug}`} className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
            관련 수업 보기
          </Link>
        ))}
      </div>
    </section>
  );
}
