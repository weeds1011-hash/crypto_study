import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizBox } from "@/components/learning/QuizBox";
import { lessons } from "@/content/lessons/seed";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessons.find((item) => item.slug === slug);
  if (!lesson) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/learn" className="text-sm font-black text-marine">
        학습 목차로 돌아가기
      </Link>
      <article className="mt-5 rounded-lg border border-line bg-panel p-6 shadow-sm">
        <p className="text-xs font-black uppercase text-forest">{lesson.categoryId}</p>
        <h2 className="mt-2 text-4xl font-black text-ink">{lesson.title}</h2>
        <p className="mt-4 text-lg leading-8 text-muted">{lesson.summary}</p>

        <Section title="30초 요약" body={lesson.simpleExplanation} />
        <Section title="생활 속 비유" body={lesson.analogy} />
        <Section title="자세한 원리" body={lesson.detailedExplanation} />
        <Section title="왜 중요한가" body={lesson.whyItMatters} />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ListBlock title="실제 예시" items={lesson.examples.map((item) => `${item.title}: ${item.description}`)} />
          <ListBlock title="자주 하는 오해" items={lesson.misconceptions} />
          <ListBlock title="위험과 한계" items={lesson.risks} />
          <ListBlock title="연결 지표" items={lesson.relatedMetricIds} />
        </div>

        <QuizBox quiz={lesson.quiz[0]} />
      </article>
    </main>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-8">
      <h3 className="text-xl font-black text-ink">{title}</h3>
      <p className="mt-3 leading-7 text-muted">{body}</p>
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
