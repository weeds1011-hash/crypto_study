"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "@/types";

function readCompleted() {
  try {
    return JSON.parse(window.localStorage.getItem("crypto-study-completed-lessons") ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function PrerequisiteStatus({ prerequisites, lessons }: { prerequisites: string[]; lessons: Lesson[] }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setCompleted(readCompleted());
    refresh();
    window.addEventListener("crypto-study-progress", refresh);
    return () => window.removeEventListener("crypto-study-progress", refresh);
  }, []);

  return (
    <section className="mt-5 rounded-md border border-line bg-paper p-4" aria-label="선수 학습 상태">
      <h3 className="font-black text-ink">선수 학습 상태</h3>
      {prerequisites.length === 0 ? (
        <p className="mt-2 text-sm leading-6 text-muted">이 수업은 바로 시작할 수 있는 첫 수업입니다.</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {prerequisites.map((slug) => {
            const lesson = lessons.find((item) => item.slug === slug);
            const done = completed.includes(slug);
            return (
              <Link key={slug} href={`/learn/${slug}`} className={`min-h-11 rounded-md border px-3 py-2 text-sm font-black focus:outline-none focus:ring-2 focus:ring-marine ${done ? "border-forest bg-[#edf8f0] text-forest" : "border-line bg-panel text-muted"}`}>
                {done ? "완료" : "먼저 보기"} · {lesson?.title ?? slug}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
