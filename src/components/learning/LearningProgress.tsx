"use client";

import { useEffect, useState } from "react";

const levels = [
  { name: "입문자", min: 0 },
  { name: "기초 탐험가", min: 25 },
  { name: "시장 해석가", min: 55 },
  { name: "온체인 분석가", min: 80 },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readCompleted() {
  if (typeof window === "undefined") return [] as string[];
  try {
    return JSON.parse(window.localStorage.getItem("crypto-study-completed-lessons") ?? "[]") as string[];
  } catch {
    return [];
  }
}

function readTodayCompleted() {
  if (typeof window === "undefined") return [] as string[];
  try {
    return JSON.parse(window.localStorage.getItem(`crypto-study-completed-${todayKey()}`) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function LearningProgress({ totalLessons }: { totalLessons: number }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [todayCompleted, setTodayCompleted] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => {
      setCompleted(readCompleted());
      setTodayCompleted(readTodayCompleted());
    };
    refresh();
    window.addEventListener("crypto-study-progress", refresh);
    return () => window.removeEventListener("crypto-study-progress", refresh);
  }, []);

  const percent = totalLessons === 0 ? 0 : Math.round((completed.length / totalLessons) * 100);
  const level = [...levels].reverse().find((item) => percent >= item.min)?.name ?? "입문자";

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm" aria-label="학습 진행률">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-forest">Study Progress</p>
          <h2 className="mt-1 text-2xl font-black text-ink">내 학습 진행률</h2>
        </div>
        <p className="text-sm font-bold text-muted">현재 레벨: {level}</p>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-paper" aria-label={`전체 학습 완료율 ${percent}%`}>
        <div className="h-full rounded-full bg-forest" style={{ width: `${percent}%` }} />
      </div>
      <dl className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md bg-paper p-4">
          <dt className="text-sm font-bold text-muted">전체 완료율</dt>
          <dd className="mt-1 text-2xl font-black text-ink">{percent}%</dd>
        </div>
        <div className="rounded-md bg-paper p-4">
          <dt className="text-sm font-bold text-muted">완료한 수업</dt>
          <dd className="mt-1 text-2xl font-black text-ink">
            {completed.length}/{totalLessons}
          </dd>
        </div>
        <div className="rounded-md bg-paper p-4">
          <dt className="text-sm font-bold text-muted">오늘 완료</dt>
          <dd className="mt-1 text-2xl font-black text-ink">{todayCompleted.length}</dd>
        </div>
      </dl>
    </section>
  );
}
