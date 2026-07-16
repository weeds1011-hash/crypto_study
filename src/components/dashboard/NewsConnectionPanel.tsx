import Link from "next/link";
import type { DataResponseMeta, NormalizedNewsItem } from "@/server/providers/types";

export function NewsConnectionPanel({ items, meta }: { items: NormalizedNewsItem[]; meta: DataResponseMeta }) {
  return (
    <section className="rounded-lg border border-dashed border-line bg-panel p-5 shadow-sm" aria-label="뉴스 연결 준비 상태">
      <p className="text-xs font-black uppercase text-forest">News Connection</p>
      <h2 className="mt-2 text-3xl font-black text-ink">뉴스와 시장 연결</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
        뉴스가 가격을 직접 움직였다고 단정하지 않고, 어떤 경로를 통해 시장에 영향을 줄 수 있는지 학습용으로 표시합니다.
      </p>
      <p className="mt-2 text-xs font-bold text-muted">
        출처: {meta.source} · 갱신: {new Date(meta.fetchedAt).toLocaleString("ko-KR")} · 상태: {meta.requestStatus}
        {meta.stale ? " · stale" : ""}
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-md border border-line bg-paper p-4">
            <span className="rounded-md bg-panel px-2 py-1 text-xs font-black text-muted">
              {item.category} · {item.dataStatus}
            </span>
            <h3 className="mt-3 font-black text-ink">{item.title}</h3>
            <p className="mt-2 text-xs font-bold text-muted">
              {item.source} · {new Date(item.publishedAt).toLocaleString("ko-KR")}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.impactPath.join(" -> ")}</p>
            <p className="mt-2 text-sm leading-6 text-muted">왜 중요할 수 있나요? 관련 경로를 통해 시장 심리나 유동성 해석에 영향을 줄 수 있습니다.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.relatedLessonIds.map((slug) => (
                <Link key={slug} href={`/learn/${slug}`} className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
                  관련 수업
                </Link>
              ))}
              {item.articleUrl !== "#" ? (
                <a href={item.articleUrl} target="_blank" rel="noreferrer" className="rounded-md border border-line bg-panel px-3 py-2 text-sm font-black text-ink">
                  원문 보기
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
