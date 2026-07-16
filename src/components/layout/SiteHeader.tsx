"use client";

import Link from "next/link";
import { useState } from "react";
import { navItems } from "@/config/routes";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="min-w-0">
            <p className="text-xs font-black uppercase text-forest">Crypto Study</p>
            <h1 className="text-xl font-black tracking-normal text-ink md:text-2xl">암호화폐 돈의 흐름 대시보드</h1>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="rounded-md border border-line bg-panel px-3 py-2 text-sm font-black text-ink md:hidden"
            aria-expanded={open}
            aria-controls="site-navigation"
          >
            {open ? "메뉴 닫기" : "메뉴 열기"}
          </button>
        </div>
        <nav id="site-navigation" className={`${open ? "grid" : "hidden"} gap-2 md:flex md:overflow-x-auto md:pb-1`} aria-label="주요 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-md border border-line bg-panel px-3 py-2 text-sm font-bold text-muted transition hover:border-forest hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
