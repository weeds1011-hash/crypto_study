import Link from "next/link";
import type { Course } from "@/content/courses/university";
import type { Lesson } from "@/types";

export function LessonFlowNav({ course, moduleTitle, lesson, nextLesson }: { course?: Course; moduleTitle?: string; lesson: Lesson; nextLesson?: Lesson | null }) {
  const items = [
    { label: "Course", value: course?.title ?? lesson.categoryId },
    { label: "Module", value: moduleTitle ?? "Module" },
    { label: "Lesson", value: lesson.title },
    { label: "Quiz", value: "수업 하단" },
    { label: "Next Lesson", value: nextLesson?.title ?? "완료" },
  ];

  return (
    <section className="mt-5 rounded-md border border-line bg-paper p-4" aria-label="학습 흐름">
      <h3 className="font-black text-ink">Course → Module → Lesson → Quiz → Next Lesson</h3>
      <div className="mt-3 grid gap-2 md:grid-cols-5">
        {items.map((item, index) => (
          <div key={item.label} className="rounded-md border border-line bg-panel p-3">
            <p className="text-xs font-black text-forest">{index + 1}. {item.label}</p>
            <p className="mt-1 text-sm font-bold leading-5 text-muted">{item.value}</p>
          </div>
        ))}
      </div>
      {nextLesson ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
          <Link href={`/learn/${nextLesson.slug}`} className="block min-h-11 rounded-md bg-ink px-4 py-3 text-center text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-marine">
            다음 수업: {nextLesson.title}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
