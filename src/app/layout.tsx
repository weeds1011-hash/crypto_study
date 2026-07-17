import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteUrl } from "@/config/routes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "암호화폐 분류와 돈의 흐름 대시보드",
  description: "암호화폐의 대분류와 소분류를 쉽게 이해하고, 돈·금리·경제와의 관계를 학습하는 대시보드입니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "암호화폐 분류와 돈의 흐름 대시보드",
    description: "암호화폐의 대분류와 소분류를 쉽게 이해하고, 돈·금리·경제와의 관계를 학습하는 대시보드입니다.",
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
