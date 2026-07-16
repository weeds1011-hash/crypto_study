"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { journeySteps } from "@/features/money-journey/journey";

const statusLabel = {
  "data-supported": "데이터 연결",
  "structure-only": "구조 설명",
};

export function MoneyJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2600);
  const activeStep = journeySteps[activeIndex];

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % journeySteps.length);
    }, speed);
    return () => window.clearInterval(timer);
  }, [isPlaying, reducedMotion, speed]);

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-calm" aria-label="돈의 여정 시각화">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-forest">Money Journey</p>
          <h2 className="mt-2 text-3xl font-black text-ink">돈은 어떤 길로 이동할까?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            거시경제에서 암호화폐 시장, 스테이블코인, DeFi까지 이어지는 흐름을 단계별로 따라갑니다.
          </p>
        </div>
        <div className="flex items-center gap-2" aria-label="여정 재생 컨트롤">
          <button
            type="button"
            onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
            className="rounded-md border border-line bg-paper p-3 text-ink focus:outline-none focus:ring-2 focus:ring-marine"
            aria-label="이전 단계"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((current) => !current)}
            className="rounded-md bg-ink p-3 text-white focus:outline-none focus:ring-2 focus:ring-marine"
            aria-label={isPlaying ? "재생 멈춤" : "단계 재생"}
          >
            {isPlaying ? "멈춤" : "재생"}
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((current) => Math.min(journeySteps.length - 1, current + 1))}
            className="rounded-md border border-line bg-paper p-3 text-ink focus:outline-none focus:ring-2 focus:ring-marine"
            aria-label="다음 단계"
          >
            다음
          </button>
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="rounded-md border border-line bg-paper px-3 py-3 text-sm font-bold text-ink focus:outline-none focus:ring-2 focus:ring-marine"
            aria-label="재생 속도"
          >
            <option value={3600}>느리게</option>
            <option value={2600}>보통</option>
            <option value={1600}>빠르게</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="돈의 이동 단계">
        {journeySteps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative rounded-md border p-4 text-left focus:outline-none focus:ring-2 focus:ring-marine ${
                isActive ? "border-marine bg-[#eef6ff]" : "border-line bg-paper"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="text-xs font-black text-forest">STEP {index + 1}</span>
              <h3 className="mt-2 font-black text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
              <span className="mt-3 inline-flex rounded-md border border-line bg-panel px-2 py-1 text-xs font-black text-muted">
                {statusLabel[step.status]}
              </span>
              {index < journeySteps.length - 1 ? (
                <span className="pointer-events-none absolute -bottom-3 left-6 h-6 w-px bg-line md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:h-px md:w-6" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
      </div>

      <article className="mt-5 rounded-md border border-line bg-paper p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-black text-ink">{activeStep.title}</h3>
          <span className="rounded-md bg-panel px-3 py-2 text-xs font-black text-muted">{statusLabel[activeStep.status]}</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">{activeStep.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {activeStep.relatedLessonIds.map((slug) => (
            <Link key={slug} href={`/learn/${slug}`} className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
              연결 수업
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}
