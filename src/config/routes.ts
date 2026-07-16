export const siteUrl = "https://cryptostudyapp.vercel.app";

export const navItems = [
  { href: "/", label: "홈", description: "시장 해설과 학습 추천" },
  { href: "/learn", label: "암호화폐 공부", description: "단계별 학습 로드맵" },
  { href: "/map", label: "암호화폐 지도", description: "개념 지도" },
  { href: "/money-flow", label: "돈의 흐름", description: "자금 흐름 엔진" },
  { href: "/markets", label: "시장 분석", description: "핵심 시장 지표" },
  { href: "/chains", label: "체인 비교", description: "Bitcoin, Ethereum, Solana 비교" },
  { href: "/coins/btc", label: "코인 상세", description: "BTC, ETH, SOL 상세 분석" },
  { href: "/alerts", label: "관심·알림", description: "관심 목록과 알림 준비" },
  { href: "/glossary", label: "용어사전", description: "암호화폐 용어 정의" },
];

export const staticRoutes = navItems.map((item) => item.href);
