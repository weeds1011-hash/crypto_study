import Link from "next/link";
import { glossaryTerms } from "@/content/glossary/seed";

export default function GlossaryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-xs font-black uppercase text-forest">Glossary</p>
      <h2 className="mt-2 text-4xl font-black text-ink">암호화폐 용어사전</h2>
      <p className="mt-4 max-w-3xl leading-7 text-muted">수업 본문에서 클릭한 용어의 자세한 설명을 여기에서 다시 확인할 수 있습니다.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {glossaryTerms.map((term) => (
          <Link key={term.id} href={`/glossary/${term.id}`} className="rounded-lg border border-line bg-panel p-5 transition hover:border-forest hover:shadow-calm">
            <p className="text-xs font-black uppercase text-marine">{term.category}</p>
            <h3 className="mt-2 text-2xl font-black text-ink">{term.term}</h3>
            {term.englishTerm ? <p className="font-bold text-muted">{term.englishTerm}</p> : null}
            <p className="mt-4 leading-7 text-muted">{term.oneLineDefinition}</p>
            <p className="mt-3 border-l-4 border-amberline pl-3 text-sm leading-6 text-muted">{term.simpleExplanation}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
