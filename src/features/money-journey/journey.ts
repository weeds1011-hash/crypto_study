export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  relatedLessonIds: string[];
  status: "structure-only" | "data-supported";
}

export const journeySteps: JourneyStep[] = [
  {
    id: "central-bank",
    title: "중앙은행·정부",
    description: "금리와 유동성 환경이 바뀌면 투자자들이 위험자산을 보는 태도가 달라질 수 있습니다.",
    relatedLessonIds: ["what-is-money"],
    status: "structure-only",
  },
  {
    id: "bonds-dollar",
    title: "채권·달러",
    description: "금리 기대와 달러 흐름은 주식, 금, 암호화폐 같은 자산의 상대 매력을 바꿀 수 있습니다.",
    relatedLessonIds: ["money-flow"],
    status: "structure-only",
  },
  {
    id: "risk-assets",
    title: "주식과 위험자산",
    description: "위험자산 선호가 커져도 그 돈이 반드시 암호화폐로 들어오는 것은 아닙니다.",
    relatedLessonIds: ["money-flow"],
    status: "structure-only",
  },
  {
    id: "crypto-market",
    title: "암호화폐 전체 시장",
    description: "전체 시가총액과 거래량은 시장으로 돈이 들어오거나 빠지는 배경을 보여주는 단서입니다.",
    relatedLessonIds: ["what-is-crypto"],
    status: "data-supported",
  },
  {
    id: "bitcoin",
    title: "비트코인",
    description: "비트코인은 시장의 기준점처럼 움직이며 도미넌스 변화로 자금 집중도를 살펴볼 수 있습니다.",
    relatedLessonIds: ["bitcoin-ethereum"],
    status: "data-supported",
  },
  {
    id: "ethereum",
    title: "이더리움",
    description: "이더리움은 스마트 계약 생태계의 중심이라 DeFi와 온체인 활동을 이해하는 데 중요합니다.",
    relatedLessonIds: ["bitcoin-ethereum", "tvl"],
    status: "structure-only",
  },
  {
    id: "alts-defi",
    title: "알트코인·DeFi",
    description: "알트코인과 DeFi 영역은 유동성에 민감하고, TVL과 사용자 활동을 함께 봐야 합니다.",
    relatedLessonIds: ["tvl", "onchain-risk"],
    status: "data-supported",
  },
  {
    id: "stablecoins",
    title: "스테이블코인·현금성 자산",
    description: "스테이블코인은 시장 안에서 대기 자금과 결제 통로 역할을 합니다.",
    relatedLessonIds: ["stablecoins"],
    status: "data-supported",
  },
];
