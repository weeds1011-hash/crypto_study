"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { lessons } from "@/content/lessons/seed";

const lessonCopy: Record<string, { title: string; reason: string }> = {
  "what-is-money": {
    title: "돈은 왜 모두가 믿을 때만 작동할까?",
    reason: "금리와 유동성 지표를 읽으려면 먼저 돈의 기본 기능을 알아야 합니다.",
  },
  "what-is-crypto": {
    title: "왜 비트코인은 디지털 금이라고 불릴까?",
    reason: "암호화폐 전체 시장과 비트코인 도미넌스를 해석하는 출발점입니다.",
  },
  stablecoins: {
    title: "스테이블코인이 시장에서 중요한 이유는?",
    reason: "시장 안의 대기 자금과 거래소·체인으로 흐르는 돈을 이해할 수 있습니다.",
  },
  tvl: {
    title: "TVL이 늘면 정말 좋은 신호일까?",
    reason: "DeFi 자금 흐름이 실제 사용인지 가격 효과인지 구분하는 연습이 됩니다.",
  },
};

function readCompleted() {
  try {
    return JSON.parse(window.localStorage.getItem("crypto-study-completed-lessons") ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveCompleted(next: string[]) {
  window.localStorage.setItem("crypto-study-completed-lessons", JSON.stringify(next));
  const today = new Date().toISOString().slice(0, 10);
  const todayKey = `crypto-study-completed-${today}`;
  const todayCompleted = JSON.parse(window.localStorage.getItem(todayKey) ?? "[]") as string[];
  const merged = Array.from(new Set([...todayCompleted, ...next.filter((slug) => !readCompleted().includes(slug))]));
  window.localStorage.setItem(todayKey, JSON.stringify(merged));
  window.dispatchEvent(new Event("crypto-study-progress"));
}

export function LessonRail() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(readCompleted());
  }, []);

  function toggleComplete(slug: string) {
    const next = completed.includes(slug) ? completed.filter((item) => item !== slug) : [...completed, slug];
    setCompleted(next);
    saveCompleted(next);
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {lessons.map((lesson) => {
        const copy = lessonCopy[lesson.slug] ?? { title: lesson.title, reason: lesson.summary };
        const done = completed.includes(lesson.slug);
        return (
          <article key={lesson.id} className="rounded-lg border border-line bg-panel p-5 transition hover:border-forest hover:shadow-calm">
            <span className="text-sm font-black text-danger">{lesson.estimatedMinutes}분</span>
            <h3 className="mt-3 text-xl font-black text-ink">{copy.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{copy.reason}</p>
            <p className="mt-4 text-sm font-bold text-marine">난이도: {lesson.difficulty}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/learn/${lesson.slug}`}
                className="rounded-md bg-ink px-4 py-2 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-marine"
              >
                시작
              </Link>
              <button
                type="button"
                onClick={() => toggleComplete(lesson.slug)}
                aria-pressed={done}
                className="rounded-md border border-line px-4 py-2 text-sm font-black text-ink focus:outline-none focus:ring-2 focus:ring-marine"
              >
                {done ? "완료됨" : "완료 표시"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
