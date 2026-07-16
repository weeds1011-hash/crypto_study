"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { MetricSnapshot } from "@/types";
import { changeTone, formatChange, formatMetricValue } from "@/lib/formatters/numbers";

const statusLabel = {
  live: "실데이터",
  mock: "샘플",
  mixed: "혼합",
  missing: "데이터 없음",
};

const statusClass = {
  live: "border-forest text-forest",
  mock: "border-amberline text-amberline",
  mixed: "border-danger text-danger",
  missing: "border-line text-muted",
};

const sizeClass = {
  feature: "min-h-[360px] md:col-span-2 xl:col-span-2",
  standard: "min-h-[320px]",
  compact: "min-h-[240px]",
};

export function MetricCard({ metric, size = "standard" }: { metric: MetricSnapshot; size?: "feature" | "standard" | "compact" }) {
  const [expanded, setExpanded] = useState(false);
  const detailId = useId();
  const chartLabel = `${metric.label}의 최근 추이 차트`;

  return (
    <article className={`flex flex-col justify-between rounded-lg border border-line bg-panel p-5 shadow-sm ${sizeClass[size]}`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-forest">{metric.sourceId}</p>
            <h3 className="mt-1 text-xl font-black text-ink">{metric.label}</h3>
          </div>
          <span
            className={`rounded-md border px-2 py-1 text-xs font-bold ${statusClass[metric.dataStatus]}`}
            aria-label={`${metric.label} 데이터 상태: ${statusLabel[metric.dataStatus]}`}
          >
            {statusLabel[metric.dataStatus]}
          </span>
        </div>
        <p className="mt-4 text-3xl font-black text-ink">{formatMetricValue(metric.value, metric.unit)}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <span className="rounded-md bg-paper p-2 font-bold">
            24h <b className={changeTone(metric.change24h)}>{formatChange(metric.change24h)}</b>
          </span>
          <span className="rounded-md bg-paper p-2 font-bold">
            7d <b className={changeTone(metric.change7d)}>{formatChange(metric.change7d)}</b>
          </span>
          <span className="rounded-md bg-paper p-2 font-bold">
            30d <b className={changeTone(metric.change30d)}>{formatChange(metric.change30d)}</b>
          </span>
        </div>
      </div>
      <div>
        <div className="mt-5 h-16">
          {metric.series.length > 0 ? (
            <div role="img" aria-label={chartLabel} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.series}>
                <Line type="monotone" dataKey="value" stroke="#245a9b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="grid h-full place-items-center rounded-md bg-paper text-sm font-bold text-muted">차트 데이터 없음</div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-muted">
          <span>현재값: {statusLabel[metric.fieldStatus.value]}</span>
          <span>변화율: {statusLabel[metric.fieldStatus.change7d]}</span>
          <span>차트: {statusLabel[metric.fieldStatus.series]}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">{metric.interpretation}</p>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={detailId}
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 rounded-md border border-line px-3 py-2 text-sm font-black text-ink transition hover:border-forest focus:outline-none focus:ring-2 focus:ring-marine"
        >
          {expanded ? "간단히 보기" : "자세히 보기"}
        </button>
        <div id={detailId} hidden={!expanded}>
          <p className="mt-3 border-l-4 border-amberline pl-3 text-sm leading-6 text-muted">{metric.caution}</p>
          <p className="mt-2 text-xs font-bold text-muted">출처: {metric.sourceId}</p>
        </div>
        {metric.learnSlug ? (
          <Link href={`/learn/${metric.learnSlug}`} className="mt-4 inline-flex text-sm font-black text-marine">
            지표 설명 보기
          </Link>
        ) : null}
      </div>
    </article>
  );
}
