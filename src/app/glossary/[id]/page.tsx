import Link from "next/link";
import { notFound } from "next/navigation";
import { glossaryTerms } from "@/content/glossary/seed";

export function generateStaticParams() {
  return glossaryTerms.map((term) => ({ id: term.id }));
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const term = glossaryTerms.find((item) => item.id === id);
  if (!term) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/glossary" className="text-sm font-black text-marine">
        용어사전으로 돌아가기
      </Link>
      <article className="mt-5 rounded-lg border border-line bg-panel p-6 shadow-sm">
        <p className="text-xs font-black uppercase text-forest">{term.category}</p>
        <h2 className="mt-2 text-4xl font-black text-ink">{term.term}</h2>
        {term.englishTerm ? <p className="mt-2 font-bold text-muted">{term.englishTerm}</p> : null}
        <p className="mt-5 text-lg leading-8 text-muted">{term.oneLineDefinition}</p>
        <section className="mt-8">
          <h3 className="text-xl font-black text-ink">쉬운 설명</h3>
          <p className="mt-3 leading-7 text-muted">{term.simpleExplanation}</p>
        </section>
        <section className="mt-8">
          <h3 className="text-xl font-black text-ink">자세한 설명</h3>
          <p className="mt-3 leading-7 text-muted">{term.detailedExplanation}</p>
        </section>
        {term.example ? (
          <section className="mt-8 rounded-md bg-paper p-4">
            <h3 className="font-black text-ink">예시</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{term.example}</p>
          </section>
        ) : null}
        <section className="mt-8">
          <h3 className="text-xl font-black text-ink">관련 용어</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {term.relatedTerms.map((related) => (
              <span key={related} className="rounded-md border border-line bg-paper px-3 py-2 text-sm font-bold text-muted">
                {related}
              </span>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
