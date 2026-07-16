import { LessonRail } from "@/components/learning/LessonRail";
import { lessonCategories, lessons } from "@/content/lessons/seed";

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-8">
        <p className="text-xs font-black uppercase text-forest">Learning</p>
        <h2 className="mt-2 text-4xl font-black text-ink">암호화폐 공부 목차</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          쉬운 설명, 생활 비유, 자세한 원리, 시장 지표 연결, 확인 문제 순서로 공부하도록 구성합니다.
        </p>
      </section>
      <section className="mb-10 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {lessonCategories.map((category, index) => {
          const count = lessons.filter((lesson) => lesson.categoryId === category).length;
          return (
            <div key={category} className="rounded-md border border-line bg-panel p-4">
              <span className="text-sm font-black text-danger">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-black text-ink">{category}</p>
              <p className="mt-2 text-sm font-bold text-muted">콘텐츠 {count}개</p>
              {count === 0 ? <span className="mt-3 inline-flex rounded-md border border-line px-2 py-1 text-xs font-black text-muted">준비 중</span> : null}
            </div>
          );
        })}
      </section>
      <LessonRail />
    </main>
  );
}
