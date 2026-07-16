"use client";

import { useEffect, useState } from "react";
import { addWatchItem, listWatchItems, removeWatchItem, type WatchItem, type WatchTargetType } from "@/features/watchlist/watchlist-storage";

const quickItems: Array<{ targetType: WatchTargetType; targetId: string; label: string }> = [
  { targetType: "coin", targetId: "btc", label: "BTC" },
  { targetType: "coin", targetId: "eth", label: "ETH" },
  { targetType: "coin", targetId: "sol", label: "SOL" },
  { targetType: "metric", targetId: "defi_tvl", label: "DeFi TVL" },
  { targetType: "news-category", targetId: "macro", label: "거시 뉴스" },
];

export function WatchlistPanel() {
  const [items, setItems] = useState<WatchItem[]>([]);

  useEffect(() => {
    setItems(listWatchItems(window.localStorage));
  }, []);

  function add(item: (typeof quickItems)[number]) {
    setItems(addWatchItem(window.localStorage, item));
  }

  function remove(id: string) {
    setItems(removeWatchItem(window.localStorage, id));
  }

  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-sm" aria-label="관심 목록">
      <p className="text-xs font-black uppercase text-forest">Watchlist</p>
      <h2 className="mt-2 text-3xl font-black text-ink">내 관심 목록</h2>
      <p className="mt-3 text-sm leading-6 text-muted">로그인 없이 이 브라우저에만 저장됩니다. 홈 개인화와 관련 뉴스·학습 추천에 사용할 준비 구조입니다.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {quickItems.map((item) => (
          <button key={`${item.targetType}-${item.targetId}`} type="button" onClick={() => add(item)} className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white">
            {item.label} 추가
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-2">
        {items.length === 0 ? (
          <p className="rounded-md bg-paper p-4 text-sm text-muted">아직 관심 항목이 없습니다.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-paper p-3">
              <span className="text-sm font-black text-ink">
                {item.label} · {item.targetType}
              </span>
              <button type="button" onClick={() => remove(item.id)} className="rounded-md border border-line bg-panel px-3 py-2 text-sm font-black text-danger">
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
