import type { Lesson, QuizQuestion } from "@/types";

export interface Course {
  id: "money-foundations" | "macro-economy" | "crypto-foundations" | "market-intelligence";
  title: string;
  oneLineSummary: string;
  lessonIds: string[];
}

export interface UniversityLesson {
  id: string;
  title: string;
  oneLineSummary: string;
  whyItMatters: string;
  prerequisiteLessons: string[];
  relatedMetrics: string[];
  relatedCoins: string[];
  relatedNewsTags: string[];
  glossaryTerms: string[];
  quiz: QuizQuestion[];
  nextLesson: string | null;
  courseId: Course["id"];
  difficulty: Lesson["difficulty"];
  estimatedMinutes: number;
}

export const courses: Course[] = [
  { id: "money-foundations", title: "Money Foundations", oneLineSummary: "경제와 돈의 기본 기능을 이해합니다.", lessonIds: ["what-is-money"] },
  { id: "macro-economy", title: "Macro Economy", oneLineSummary: "금리, 달러, 유동성이 위험자산에 주는 영향을 배웁니다.", lessonIds: ["macro-liquidity"] },
  { id: "crypto-foundations", title: "Crypto Foundations", oneLineSummary: "암호화폐, 블록체인, BTC·ETH·스테이블코인의 구조를 배웁니다.", lessonIds: ["what-is-crypto", "bitcoin-ethereum", "stablecoins", "tokenomics"] },
  { id: "market-intelligence", title: "Market Intelligence", oneLineSummary: "TVL, 온체인 데이터, 돈의 흐름을 조합해 시장을 해석합니다.", lessonIds: ["tvl", "money-flow", "onchain-risk"] },
];

export const universityLessons: UniversityLesson[] = [
  lesson("what-is-money", "money-foundations", "돈은 무엇인가?", "돈은 가치를 저장하고, 교환하고, 가격을 비교하게 해주는 사회적 약속입니다.", "금리, 달러, 유동성 같은 거시경제 지표를 이해하는 출발점입니다.", [], ["global_liquidity", "fed_rate"], [], ["macro"], ["법정화폐", "인플레이션", "유동성"], "macro-liquidity", "beginner", 5),
  lesson("macro-liquidity", "macro-economy", "금리와 유동성은 시장에 왜 중요할까?", "금리, 달러, 유동성은 위험자산 선호가 커지거나 줄어드는 배경을 만듭니다.", "암호화폐 가격만 보면 놓치기 쉬운 돈의 큰 흐름을 이해하게 해줍니다.", ["what-is-money"], ["fed_rate", "global_liquidity", "crypto_market_cap"], ["btc"], ["macro", "regulation"], ["유동성", "인플레이션", "시가총액"], "what-is-crypto", "beginner", 7),
  lesson("what-is-crypto", "crypto-foundations", "암호화폐는 무엇인가?", "암호화폐는 블록체인 같은 네트워크에서 소유권과 거래가 기록되는 디지털 자산입니다.", "코인의 목적을 모르면 가격 움직임만 보고 잘못된 결론을 내리기 쉽습니다.", ["macro-liquidity"], ["crypto_market_cap", "btc_dominance"], ["btc", "eth"], ["bitcoin", "ethereum", "regulation"], ["블록체인", "개인키", "시가총액"], "bitcoin-ethereum", "beginner", 7),
  lesson("bitcoin-ethereum", "crypto-foundations", "비트코인과 이더리움은 어떻게 다른가?", "비트코인은 희소성과 가치 저장 논리가 강하고, 이더리움은 앱과 스마트 계약 생태계가 핵심입니다.", "비트코인 도미넌스가 변할 때 시장 관심이 어디로 이동하는지 이해하는 데 필요합니다.", ["what-is-crypto"], ["btc_dominance", "crypto_market_cap"], ["btc", "eth"], ["bitcoin", "ethereum"], ["비트코인 도미넌스", "스마트 계약", "가스비"], "stablecoins", "beginner", 8),
  lesson("stablecoins", "crypto-foundations", "스테이블코인은 왜 중요한가?", "스테이블코인은 시장 안에서 현금성 대기 자금처럼 쓰입니다.", "암호화폐 시장의 유동성, 거래소 자금, 온체인 결제 흐름을 읽는 핵심 지표입니다.", ["bitcoin-ethereum"], ["stablecoin_supply", "crypto_market_cap"], ["btc", "eth", "sol"], ["stablecoin", "exchange"], ["스테이블코인", "디페깅", "유동성"], "tokenomics", "beginner", 8),
  lesson("tokenomics", "crypto-foundations", "토큰 경제학은 왜 중요한가?", "토큰 경제학은 공급량, 유통량, 보상, 락업처럼 토큰 가치에 영향을 주는 구조를 봅니다.", "시가총액과 FDV를 비교해 현재 가격이 어떤 공급 구조 위에 있는지 이해할 수 있습니다.", ["stablecoins"], ["crypto_market_cap"], ["btc", "eth", "sol"], ["bitcoin", "ethereum", "defi"], ["시가총액", "FDV", "락업"], "tvl", "intermediate", 9),
  lesson("tvl", "market-intelligence", "TVL은 무엇인가?", "TVL은 디파이 프로토콜에 예치된 자산 규모를 뜻합니다.", "온체인 생태계에 돈이 머무는지, 빠지는지 판단하는 대표 지표입니다.", ["tokenomics"], ["defi_tvl"], ["eth", "sol"], ["defi", "security"], ["TVL", "DeFi", "스마트 계약"], "money-flow", "beginner", 7),
  lesson("money-flow", "market-intelligence", "돈의 흐름은 어떻게 읽을까?", "거시경제에서 위험자산, 암호화폐 시장, 체인과 프로토콜로 이어지는 자금 이동을 추정합니다.", "시장이 왜 오르거나 흔들리는지 설명할 때 가격보다 먼저 자금의 경로를 볼 수 있습니다.", ["tvl"], ["global_liquidity", "crypto_market_cap", "stablecoin_supply", "defi_tvl"], ["btc", "eth", "sol"], ["macro", "stablecoin", "exchange", "defi"], ["유동성", "비트코인 도미넌스", "TVL"], "onchain-risk", "intermediate", 10),
  lesson("onchain-risk", "market-intelligence", "온체인 데이터와 위험은 어떻게 봐야 할까?", "지갑, 거래, TVL, 브릿지 흐름 같은 온체인 데이터는 투명하지만 해석에는 주의가 필요합니다.", "숫자의 의미와 한계를 함께 이해하면 사기와 과열을 피하는 데 도움이 됩니다.", ["money-flow"], ["defi_tvl"], ["btc", "eth", "sol"], ["security", "defi", "exchange"], ["온체인", "브릿지", "개인키"], null, "intermediate", 9),
];

export const universityLessonsById = new Map(universityLessons.map((item) => [item.id, item]));

export function toLegacyLesson(item: UniversityLesson): Lesson {
  return {
    id: item.id,
    slug: item.id,
    categoryId: courses.find((course) => course.id === item.courseId)?.title ?? item.courseId,
    title: item.title,
    summary: item.oneLineSummary,
    simpleExplanation: item.oneLineSummary,
    analogy: `${item.title}를 이해하면 경제, 돈, 암호화폐 시장을 한 흐름으로 연결해 볼 수 있습니다.`,
    detailedExplanation: `${item.oneLineSummary} ${item.whyItMatters} 다만 단일 지표나 뉴스만으로 시장 방향을 단정하지 않습니다.`,
    whyItMatters: item.whyItMatters,
    examples: [{ title: "연결 지표", description: item.relatedMetrics.length ? item.relatedMetrics.join(", ") : "직접 연결된 지표가 없습니다." }],
    misconceptions: ["하나의 뉴스나 지표만으로 가격 방향을 확정할 수 없습니다."],
    risks: ["데이터 지연, 출처 차이, 해석 오류를 항상 함께 봐야 합니다."],
    relatedTerms: item.glossaryTerms,
    relatedMetricIds: item.relatedMetrics,
    prerequisites: item.prerequisiteLessons,
    nextLessons: item.nextLesson ? [item.nextLesson] : [],
    quiz: item.quiz,
    difficulty: item.difficulty,
    estimatedMinutes: item.estimatedMinutes,
  };
}

function lesson(
  id: string,
  courseId: Course["id"],
  title: string,
  oneLineSummary: string,
  whyItMatters: string,
  prerequisiteLessons: string[],
  relatedMetrics: string[],
  relatedCoins: string[],
  relatedNewsTags: string[],
  glossaryTerms: string[],
  nextLesson: string | null,
  difficulty: Lesson["difficulty"],
  estimatedMinutes: number,
): UniversityLesson {
  return {
    id,
    courseId,
    title,
    oneLineSummary,
    whyItMatters,
    prerequisiteLessons,
    relatedMetrics,
    relatedCoins,
    relatedNewsTags,
    glossaryTerms,
    nextLesson,
    difficulty,
    estimatedMinutes,
    quiz: [
      {
        question: `${title}를 볼 때 가장 안전한 태도는?`,
        options: ["근거와 한계를 함께 본다", "가격 방향을 확정한다", "데이터 없음은 0으로 본다", "뉴스 하나만 믿는다"],
        answerIndex: 0,
        explanation: "학습 시스템은 연결된 지표, 뉴스, 용어, 한계를 함께 보도록 설계되어 있습니다.",
      },
    ],
  };
}
