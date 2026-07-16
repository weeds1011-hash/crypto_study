import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteUrl } from "@/config/routes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "암호화폐 학습 및 돈의 흐름 대시보드",
  description: "암호화폐 개념, 시장 데이터, 돈의 흐름을 함께 공부하는 대시보드",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "암호화폐 학습 및 돈의 흐름 대시보드",
    description: "암호화폐 개념, 시장 데이터, 돈의 흐름을 함께 공부하는 대시보드",
    url: siteUrl,
    siteName: "Crypto Study",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-sans antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
