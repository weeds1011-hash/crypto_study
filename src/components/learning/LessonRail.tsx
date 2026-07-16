import Link from "next/link";
import { lessons } from "@/content/lessons/seed";

export function LessonRail() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {lessons.map((lesson, index) => (
        <Link
          key={lesson.id}
          href={`/learn/${lesson.slug}`}
          className="rounded-lg border border-line bg-panel p-5 transition hover:border-forest hover:shadow-calm"
        >
          <span className="text-sm font-black text-danger">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-xl font-black text-ink">{lesson.title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{lesson.summary}</p>
          <p className="mt-4 text-sm font-bold text-marine">{lesson.estimatedMinutes}분 · {lesson.difficulty}</p>
        </Link>
      ))}
    </div>
  );
}
