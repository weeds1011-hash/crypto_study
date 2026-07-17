"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { courses } from "@/content/courses/university";
import type { Lesson } from "@/types";

const roadmap = courses.map((course) => ({ title: course.title, note: course.oneLineSummary }));

function readCompleted() {
  try {
    return JSON.parse(window.localStorage.getItem("crypto-study-completed-lessons") ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function LearningRoadmap({ lessons }: { lessons: Lesson[] }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setCompleted(readCompleted());
    refresh();
    window.addEventListener("crypto-study-progress", refresh);
    return () => window.removeEventListener("crypto-study-progress", refresh);
  }, []);

  const stages = useMemo(
    () =>
      roadmap.map((stage, index) => {
        const stageLessons = lessons.filter((lesson) => lesson.categoryId === stage.title);
        const completedCount = stageLessons.filter((lesson) => completed.includes(lesson.slug)).length;
        const minutes = stageLessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);
        const percent = stageLessons.length === 0 ? 0 : Math.round((completedCount / stageLessons.length) * 100);
        const previous = index === 0 ? null : roadmap[index - 1];
        const previousLessons = previous ? lessons.filter((lesson) => lesson.categoryId === previous.title) : [];
        const previousDone = previousLessons.length === 0 || previousLessons.some((lesson) => completed.includes(lesson.slug));
        const status = index === 0 || previousDone ? (percent > 0 ? "진행 중" : "추천") : "잠금";
        return { ...stage, index, lessons: stageLessons, completedCount, minutes, percent, status };
      }),
    [completed, lessons],
  );

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm" aria-label="학습 로드맵">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-forest">Roadmap</p>
          <h2 className="mt-1 text-3xl font-black text-ink">Crypto University 4개 코스</h2>
        </div>
        <p className="text-sm font-bold text-muted">잠금은 추천 순서 표시이며, 수업은 언제든 열 수 있습니다.</p>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-4">
        {stages.map((stage) => {
          const firstLesson = stage.lessons[0];
          return (
            <article key={stage.title} className="rounded-md border border-line bg-paper p-4">
              <span className="text-sm font-black text-danger">{stage.index + 1}단계</span>
              <h3 className="mt-2 font-black text-ink">{stage.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{stage.note}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white" aria-label={`${stage.title} 완료율 ${stage.percent}%`}>
                <div className="h-full rounded-full bg-forest" style={{ width: `${stage.percent}%` }} />
              </div>
              <p className="mt-3 text-xs font-bold text-muted">
                {stage.completedCount}/{stage.lessons.length}개 완료 · {stage.minutes}분
              </p>
              <span className="mt-3 inline-flex rounded-md border border-line bg-panel px-2 py-1 text-xs font-black text-ink">{stage.status}</span>
              {firstLesson ? (
                <Link href={`/learn/${firstLesson.slug}`} className="mt-3 block min-h-11 text-sm font-black text-marine focus:outline-none focus:ring-2 focus:ring-marine">
                  이 단계 시작
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
