import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "암호화폐 학습 및 돈의 흐름 대시보드",
  description: "암호화폐 개념, 시장 데이터, 돈의 흐름을 함께 공부하는 대시보드",
};

const navItems = [
  { href: "/", label: "홈" },
  { href: "/learn", label: "암호화폐 공부" },
  { href: "/map", label: "암호화폐 지도" },
  { href: "/money-flow", label: "돈의 흐름" },
  { href: "/markets", label: "시장 분석" },
  { href: "/glossary", label: "용어사전" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="min-w-0">
              <p className="text-xs font-black uppercase text-forest">Crypto Study</p>
              <h1 className="text-xl font-black tracking-normal text-ink md:text-2xl">암호화폐 돈의 흐름 대시보드</h1>
            </Link>
            <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="주요 메뉴">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-md border border-line bg-panel px-3 py-2 text-sm font-bold text-muted transition hover:border-forest hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
