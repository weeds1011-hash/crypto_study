import Link from "next/link";
import type { Lesson } from "@/types";
import type { LessonRecommendation } from "@/features/lesson-recommendations/recommendations";

const typeLabel = {
  "market-related": "시장 연결",
  "next-step": "다음 단계",
  review: "복습",
  "beginner-essential": "기초 필수",
};

export function LessonRecommendations({ recommendations, lessons }: { recommendations: LessonRecommendation[]; lessons: Lesson[] }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-forest">Recommended Lessons</p>
      <h2 className="mt-1 text-3xl font-black text-ink">오늘 공부하면 좋은 개념</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {recommendations.map((recommendation) => {
          const lesson = lessons.find((item) => item.slug === recommendation.lessonId);
          if (!lesson) return null;
          return (
            <article key={recommendation.lessonId} className="rounded-md border border-line bg-paper p-4">
              <span className="text-xs font-black text-marine">{typeLabel[recommendation.recommendationType]}</span>
              <h3 className="mt-2 font-black text-ink">{lesson.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{recommendation.reasons[0]}</p>
              <p className="mt-3 text-xs font-bold text-muted">
                {lesson.estimatedMinutes}분 · {lesson.difficulty} · {recommendation.prerequisiteStatus}
              </p>
              <Link href={`/learn/${lesson.slug}`} className="mt-4 inline-flex rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                학습 시작
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
