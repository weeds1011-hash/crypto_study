import Link from "next/link";
import { notFound } from "next/navigation";
import { GlossaryText } from "@/components/learning/GlossaryText";
import { LearningBreadcrumb } from "@/components/learning/LearningBreadcrumb";
import { LearningProgressInline } from "@/components/learning/LearningProgressInline";
import { LessonFlowNav } from "@/components/learning/LessonFlowNav";
import { MarketMetricLinks } from "@/components/learning/MarketMetricLinks";
import { PrerequisiteStatus } from "@/components/learning/PrerequisiteStatus";
import { QuizBox } from "@/components/learning/QuizBox";
import { UserNotes } from "@/components/notes/UserNotes";
import { courseForLesson, moduleForLesson } from "@/content/courses/university";
import { glossaryTerms } from "@/content/glossary/seed";
import { lessons } from "@/content/lessons/seed";
import { getDashboardData } from "@/features/market-data/service";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessons.find((item) => item.slug === slug);
  if (!lesson) notFound();

  const dashboard = await getDashboardData();
  const relatedMetrics = dashboard.metrics.filter((metric) => lesson.relatedMetricIds.includes(metric.metricId));
  const nextLesson = lesson.nextLessons[0] ? lessons.find((item) => item.slug === lesson.nextLessons[0]) : null;
  const course = courseForLesson(lesson.slug);
  const moduleInfo = moduleForLesson(lesson.slug);
  const moduleTitle = moduleInfo ? `${moduleInfo.title} / ${moduleInfo.total}` : undefined;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 pb-24 md:pb-10">
      <LearningBreadcrumb course={course} moduleTitle={moduleTitle} lessonTitle={lesson.title} />
      <Link href="/learn" className="mt-4 inline-flex text-sm font-black text-marine focus:outline-none focus:ring-2 focus:ring-marine">
        학습 로드맵으로 돌아가기
      </Link>
      <div className="mt-5">
        <LearningProgressInline lessons={lessons} />
      </div>
      <article className="mt-5 rounded-lg border border-line bg-panel p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-forest">{lesson.categoryId}</p>
            <h2 className="mt-2 text-4xl font-black text-ink">{lesson.title}</h2>
            <p className="mt-4 text-lg leading-8 text-muted">{lesson.summary}</p>
          </div>
          <div className="rounded-md bg-paper p-4 text-sm font-bold text-muted">
            {lesson.estimatedMinutes}분 · {lesson.difficulty}
          </div>
        </div>

        <LessonFlowNav course={course} moduleTitle={moduleTitle} lesson={lesson} nextLesson={nextLesson} />
        <PrerequisiteStatus prerequisites={lesson.prerequisites} lessons={lessons} />

        <Section title="30초 요약" body={lesson.simpleExplanation} />
        <Section title="쉬운 비유" body={lesson.analogy} />
        <Section title="핵심 개념" body={lesson.detailedExplanation} />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ListBlock title="실제 사례" items={lesson.examples.map((item) => `${item.title}: ${item.description}`)} />
          <ListBlock title="자주 하는 오해" items={lesson.misconceptions} />
        </div>

        <MarketMetricLinks metrics={relatedMetrics} />
        <QuizBox quiz={lesson.quiz[0]} lessonSlug={lesson.slug} />
        <div className="mt-8">
          <UserNotes targetType="lesson" targetId={lesson.slug} />
        </div>

        <section className="mt-8 rounded-md border border-line bg-paper p-5">
          <h3 className="text-xl font-black text-ink">다음 학습</h3>
          {nextLesson ? (
            <Link href={`/learn/${nextLesson.slug}`} className="mt-3 inline-flex min-h-11 items-center rounded-md bg-ink px-4 py-2 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-marine">
              {nextLesson.title}
            </Link>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">마지막 수업입니다. 로드맵에서 완료율을 확인해보세요.</p>
          )}
        </section>
      </article>
    </main>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-8">
      <h3 className="text-xl font-black text-ink">{title}</h3>
      <GlossaryText text={body} terms={glossaryTerms} />
    </section>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-md border border-line p-4">
      <h3 className="font-black text-ink">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
