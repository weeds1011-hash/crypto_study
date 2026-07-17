"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/types";

function readCompleted() {
  try {
    return JSON.parse(window.localStorage.getItem("crypto-study-completed-lessons") ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function LearningProgressInline({ lessons }: { lessons: Lesson[] }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setCompleted(readCompleted());
    refresh();
    window.addEventListener("crypto-study-progress", refresh);
    return () => window.removeEventListener("crypto-study-progress", refresh);
  }, []);

  const completedCount = lessons.filter((lesson) => completed.includes(lesson.slug)).length;
  const percent = lessons.length === 0 ? 0 : Math.round((completedCount / lessons.length) * 100);

  return (
    <section className="rounded-md border border-line bg-panel p-4" aria-label="전체 학습 진도">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-ink">학습 진도</h3>
        <p className="text-sm font-black text-muted">{completedCount}/{lessons.length} · {percent}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper" aria-hidden="true">
        <div className="h-full rounded-full bg-forest" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}
