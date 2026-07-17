import type { Lesson, QuizQuestion } from "@/types";

export interface Course {
  id: "money-foundations" | "macro-economy" | "money-flow" | "crypto-foundations" | "market-intelligence";
  title: string;
  oneLineSummary: string;
  lessonIds: string[];
}

export interface UniversityLesson {
  id: string;
  title: string;
  oneLineSummary: string;
  whyItMatters: string;
  moneyFlowPosition: string;
  currentMarketConnection: string;
  prerequisiteLessons: string[];
  relatedMetrics: string[];
  relatedNews: string[];
  relatedNewsTags: string[];
  relatedCoins: string[];
  relatedChains: string[];
  relatedMacroFactors: string[];
  glossaryTerms: string[];
  aiMentorQuestions: string[];
  quiz: QuizQuestion[];
  nextLesson: string | null;
  courseId: Course["id"];
  difficulty: Lesson["difficulty"];
  estimatedMinutes: number;
}

interface LessonInput {
  id: string;
  courseId: Course["id"];
  title: string;
  oneLineSummary: string;
  whyItMatters: string;
  moneyFlowPosition: string;
  currentMarketConnection: string;
  prerequisiteLessons: string[];
  relatedMetrics: string[];
  relatedNews: string[];
  relatedCoins: string[];
  relatedChains: string[];
  relatedMacroFactors: string[];
  glossaryTerms: string[];
  aiMentorQuestions: string[];
  nextLesson: string | null;
  difficulty: Lesson["difficulty"];
  estimatedMinutes: number;
}

export const courses: Course[] = [
  { id: "money-foundations", title: "Money Foundations", oneLineSummary: "돈과 화폐가 시장에서 어떤 역할을 하는지 배웁니다.", lessonIds: ["what-is-money"] },
  { id: "macro-economy", title: "Macro Economy", oneLineSummary: "금리, 달러, 유동성이 위험자산에 주는 영향을 배웁니다.", lessonIds: ["macro-liquidity"] },
  { id: "money-flow", title: "Money Flow", oneLineSummary: "돈이 거시경제에서 암호화폐 시장으로 이동하는 경로를 먼저 잡습니다.", lessonIds: ["money-flow"] },
  { id: "crypto-foundations", title: "Crypto Foundations", oneLineSummary: "암호화폐, 블록체인, BTC, ETH, 스테이블코인의 기본 구조를 배웁니다.", lessonIds: ["what-is-crypto", "bitcoin-ethereum", "stablecoins", "tokenomics"] },
  { id: "market-intelligence", title: "Market Intelligence", oneLineSummary: "TVL, 온체인 데이터, 위험 신호를 조합해 시장을 해석합니다.", lessonIds: ["tvl", "onchain-risk"] },
];

export const universityLessons: UniversityLesson[] = [
  lesson({
    id: "what-is-money",
    courseId: "money-foundations",
    title: "돈이란 무엇인가?",
    oneLineSummary: "돈은 가치를 저장하고, 교환을 쉽게 만들고, 가격을 비교하게 해주는 사회적 약속입니다.",
    whyItMatters: "금리, 달러, 유동성 같은 거시경제 지표를 이해하려면 먼저 돈의 기능을 알아야 합니다.",
    moneyFlowPosition: "돈의 출발점입니다. 현금, 예금, 국채, 위험자산으로 이동하기 전 기준 역할을 합니다.",
    currentMarketConnection: "세계 유동성과 금리 카드를 볼 때 돈이 위험자산으로 움직일 여유가 있는지 판단하는 기초가 됩니다.",
    prerequisiteLessons: [],
    relatedMetrics: ["global_liquidity", "fed_rate"],
    relatedNews: ["macro"],
    relatedCoins: [],
    relatedChains: [],
    relatedMacroFactors: ["liquidity", "interest-rate"],
    glossaryTerms: ["유동성", "시가총액"],
    aiMentorQuestions: ["돈과 유동성은 어떻게 다른가요?", "금리가 오르면 위험자산에는 어떤 부담이 생기나요?"],
    nextLesson: "macro-liquidity",
    difficulty: "beginner",
    estimatedMinutes: 5,
  }),
  lesson({
    id: "macro-liquidity",
    courseId: "macro-economy",
    title: "금리와 유동성은 왜 중요할까?",
    oneLineSummary: "금리와 유동성은 시장이 위험을 감수할 여유가 있는지 보여주는 배경 지표입니다.",
    whyItMatters: "암호화폐 가격만 보면 놓치기 쉬운 큰 자금 흐름을 읽는 데 도움이 됩니다.",
    moneyFlowPosition: "거시경제에서 위험자산으로 들어오는 관문입니다. 금리와 달러 환경이 자금의 방향을 흔듭니다.",
    currentMarketConnection: "달러 금리와 세계 유동성 카드의 상태가 시장 해설의 기본 전제가 됩니다.",
    prerequisiteLessons: ["what-is-money"],
    relatedMetrics: ["fed_rate", "global_liquidity", "crypto_market_cap"],
    relatedNews: ["macro", "regulation"],
    relatedCoins: ["btc"],
    relatedChains: ["bitcoin"],
    relatedMacroFactors: ["interest-rate", "dollar-liquidity"],
    glossaryTerms: ["유동성", "시가총액"],
    aiMentorQuestions: ["유동성이 줄어들면 암호화폐 시장에는 어떤 한계가 생기나요?", "금리와 비트코인 도미넌스는 함께 봐도 되나요?"],
    nextLesson: "money-flow",
    difficulty: "beginner",
    estimatedMinutes: 7,
  }),
  lesson({
    id: "money-flow",
    courseId: "money-flow",
    title: "돈의 흐름은 어떻게 읽을까?",
    oneLineSummary: "거시경제에서 위험자산, 암호화폐 시장, 체인과 프로토콜로 이어지는 자금 이동을 추적합니다.",
    whyItMatters: "시장이 왜 오르거나 흔들리는지 설명하려면 가격보다 먼저 자금의 경로를 봐야 합니다.",
    moneyFlowPosition: "Macro Economy와 Crypto Foundations를 잇는 중심 허브입니다. 현금성 자금, BTC, ETH, DeFi로 이어지는 이동 경로를 연결합니다.",
    currentMarketConnection: "돈의 흐름 엔진, 스테이블코인 공급량, 암호화폐 시가총액, DeFi TVL을 함께 해석합니다.",
    prerequisiteLessons: ["macro-liquidity"],
    relatedMetrics: ["global_liquidity", "crypto_market_cap", "stablecoin_supply", "defi_tvl"],
    relatedNews: ["macro", "stablecoin", "exchange", "defi"],
    relatedCoins: ["btc", "eth", "sol"],
    relatedChains: ["bitcoin", "ethereum", "solana"],
    relatedMacroFactors: ["liquidity", "risk-appetite", "dollar-liquidity"],
    glossaryTerms: ["유동성", "비트코인 도미넌스", "TVL"],
    aiMentorQuestions: ["오늘 돈은 BTC 쪽에 가까운가요, DeFi 쪽에 가까운가요?", "스테이블코인 공급 증가를 바로 매수세로 봐도 되나요?"],
    nextLesson: "what-is-crypto",
    difficulty: "intermediate",
    estimatedMinutes: 10,
  }),
  lesson({
    id: "what-is-crypto",
    courseId: "crypto-foundations",
    title: "암호화폐는 무엇인가?",
    oneLineSummary: "암호화폐는 블록체인 네트워크에서 소유권과 거래가 기록되는 디지털 자산입니다.",
    whyItMatters: "코인의 목적을 모르면 가격 움직임만 보고 잘못된 결론에 이르기 쉽습니다.",
    moneyFlowPosition: "위험자산으로 들어온 돈이 실제 디지털 네트워크 자산으로 바뀌는 지점입니다.",
    currentMarketConnection: "암호화폐 전체 시가총액과 BTC 도미넌스를 통해 시장 규모와 집중도를 확인합니다.",
    prerequisiteLessons: ["money-flow"],
    relatedMetrics: ["crypto_market_cap", "btc_dominance"],
    relatedNews: ["bitcoin", "ethereum", "regulation"],
    relatedCoins: ["btc", "eth"],
    relatedChains: ["bitcoin", "ethereum"],
    relatedMacroFactors: ["risk-appetite"],
    glossaryTerms: ["블록체인", "개인키", "시가총액"],
    aiMentorQuestions: ["암호화폐를 주식처럼만 보면 어떤 점을 놓치나요?", "시가총액이 커지면 시장이 건강하다고 봐도 되나요?"],
    nextLesson: "bitcoin-ethereum",
    difficulty: "beginner",
    estimatedMinutes: 7,
  }),
  lesson({
    id: "bitcoin-ethereum",
    courseId: "crypto-foundations",
    title: "비트코인과 이더리움은 어떻게 다를까?",
    oneLineSummary: "비트코인은 희소성과 가치 저장 서사가 강하고, 이더리움은 앱과 스마트 계약 생태계가 핵심입니다.",
    whyItMatters: "비트코인 도미넌스가 변할 때 시장 관심이 어디로 이동하는지 이해할 수 있습니다.",
    moneyFlowPosition: "암호화폐 시장 안에서 BTC 중심 흐름과 ETH 생태계 흐름을 구분하는 분기점입니다.",
    currentMarketConnection: "BTC 도미넌스와 전체 시가총액을 함께 보며 자금 집중과 확산을 구분합니다.",
    prerequisiteLessons: ["what-is-crypto"],
    relatedMetrics: ["btc_dominance", "crypto_market_cap"],
    relatedNews: ["bitcoin", "ethereum"],
    relatedCoins: ["btc", "eth"],
    relatedChains: ["bitcoin", "ethereum"],
    relatedMacroFactors: ["risk-appetite"],
    glossaryTerms: ["비트코인 도미넌스", "스마트 계약", "가스비"],
    aiMentorQuestions: ["BTC 도미넌스가 오르면 알트코인은 항상 약한가요?", "ETH와 BTC는 같은 지표로 비교해도 되나요?"],
    nextLesson: "stablecoins",
    difficulty: "beginner",
    estimatedMinutes: 8,
  }),
  lesson({
    id: "stablecoins",
    courseId: "crypto-foundations",
    title: "스테이블코인은 왜 중요할까?",
    oneLineSummary: "스테이블코인은 시장 안에서 현금처럼 대기하거나 이동하는 자금 통로로 쓰입니다.",
    whyItMatters: "암호화폐 시장의 유동성, 거래소 자금, 온체인 결제 흐름을 읽는 핵심 지표입니다.",
    moneyFlowPosition: "암호화폐 시장 내부의 현금성 대기 자금과 거래소·체인 이동을 보여주는 통로입니다.",
    currentMarketConnection: "스테이블코인 공급량과 거래소·체인 노드를 연결해 대기 자금의 성격을 확인합니다.",
    prerequisiteLessons: ["bitcoin-ethereum"],
    relatedMetrics: ["stablecoin_supply", "crypto_market_cap"],
    relatedNews: ["stablecoin", "exchange"],
    relatedCoins: ["btc", "eth", "sol"],
    relatedChains: ["ethereum", "solana"],
    relatedMacroFactors: ["dollar-liquidity"],
    glossaryTerms: ["스테이블코인", "유동성"],
    aiMentorQuestions: ["스테이블코인 공급이 늘면 어떤 확인이 더 필요한가요?", "디페깅 뉴스는 돈의 흐름 해석에 어떤 영향을 주나요?"],
    nextLesson: "tokenomics",
    difficulty: "beginner",
    estimatedMinutes: 8,
  }),
  lesson({
    id: "tokenomics",
    courseId: "crypto-foundations",
    title: "토큰 경제학은 왜 중요할까?",
    oneLineSummary: "토큰 경제학은 공급량, 유통량, 보상, 락업처럼 토큰 가치에 영향을 주는 구조를 봅니다.",
    whyItMatters: "시가총액과 FDV를 비교하면 현재 가격이 어떤 공급 구조 위에 있는지 더 잘 이해할 수 있습니다.",
    moneyFlowPosition: "시장으로 들어온 돈이 특정 토큰 가격에 반영될 때 공급 구조가 병목이 되는 구간입니다.",
    currentMarketConnection: "전체 시가총액만으로는 보이지 않는 공급 부담과 유통 구조를 함께 점검합니다.",
    prerequisiteLessons: ["stablecoins"],
    relatedMetrics: ["crypto_market_cap"],
    relatedNews: ["bitcoin", "ethereum", "defi"],
    relatedCoins: ["btc", "eth", "sol"],
    relatedChains: ["bitcoin", "ethereum", "solana"],
    relatedMacroFactors: ["risk-appetite"],
    glossaryTerms: ["시가총액"],
    aiMentorQuestions: ["시가총액과 공급 구조를 같이 봐야 하는 이유는 무엇인가요?", "락업 해제는 항상 나쁜 신호인가요?"],
    nextLesson: "tvl",
    difficulty: "intermediate",
    estimatedMinutes: 9,
  }),
  lesson({
    id: "tvl",
    courseId: "market-intelligence",
    title: "TVL은 무엇인가?",
    oneLineSummary: "TVL은 디파이 프로토콜에 예치된 자산의 총 가치를 뜻합니다.",
    whyItMatters: "온체인 생태계에 돈이 머무는지 빠지는지 판단하는 대표 지표입니다.",
    moneyFlowPosition: "BTC와 ETH를 지나 DeFi 프로토콜까지 돈이 확산되는지 확인하는 구간입니다.",
    currentMarketConnection: "DeFi TVL 카드와 ETH, SOL 체인 활동을 연결해 생태계 자금 체류를 봅니다.",
    prerequisiteLessons: ["tokenomics"],
    relatedMetrics: ["defi_tvl"],
    relatedNews: ["defi", "security"],
    relatedCoins: ["eth", "sol"],
    relatedChains: ["ethereum", "solana"],
    relatedMacroFactors: ["risk-appetite"],
    glossaryTerms: ["TVL", "DeFi", "스마트 계약"],
    aiMentorQuestions: ["TVL 증가가 실제 사용 증가인지 어떻게 구분하나요?", "TVL과 토큰 가격은 왜 다르게 움직일 수 있나요?"],
    nextLesson: "onchain-risk",
    difficulty: "beginner",
    estimatedMinutes: 7,
  }),
  lesson({
    id: "onchain-risk",
    courseId: "market-intelligence",
    title: "온체인 데이터의 위험은 어떻게 봐야 할까?",
    oneLineSummary: "지갑, 거래, TVL, 브릿지 흐름 같은 온체인 데이터는 투명하지만 해석에는 한계가 있습니다.",
    whyItMatters: "숫자의 의미와 한계를 함께 이해하면 과열과 착시를 더 잘 구분할 수 있습니다.",
    moneyFlowPosition: "돈의 흐름을 마지막으로 검증하는 안전장치입니다. 체인 데이터가 실제 사용자, 자금, 위험 중 무엇을 보여주는지 구분합니다.",
    currentMarketConnection: "DeFi TVL, 관련 뉴스, 체인 활동을 함께 보며 데이터 부족이나 해석 한계를 확인합니다.",
    prerequisiteLessons: ["tvl"],
    relatedMetrics: ["defi_tvl"],
    relatedNews: ["security", "defi", "exchange"],
    relatedCoins: ["btc", "eth", "sol"],
    relatedChains: ["bitcoin", "ethereum", "solana"],
    relatedMacroFactors: ["risk-appetite", "liquidity"],
    glossaryTerms: ["브릿지", "개인키", "DeFi"],
    aiMentorQuestions: ["활성 주소를 사용자 수로 봐도 되나요?", "온체인 데이터가 부족하면 어떤 결론을 피해야 하나요?"],
    nextLesson: null,
    difficulty: "intermediate",
    estimatedMinutes: 9,
  }),
];

export const universityLessonsById = new Map(universityLessons.map((item) => [item.id, item]));

export function courseForLesson(lessonId: string) {
  const item = universityLessonsById.get(lessonId);
  return item ? courses.find((course) => course.id === item.courseId) : undefined;
}

export function moduleForLesson(lessonId: string) {
  const item = universityLessonsById.get(lessonId);
  const course = item ? courses.find((candidate) => candidate.id === item.courseId) : undefined;
  if (!item || !course) return undefined;
  const index = course.lessonIds.indexOf(item.id);
  return {
    index: index >= 0 ? index + 1 : 1,
    title: `Module ${index >= 0 ? index + 1 : 1}`,
    total: course.lessonIds.length,
  };
}

export function toLegacyLesson(item: UniversityLesson): Lesson {
  return {
    id: item.id,
    slug: item.id,
    categoryId: courses.find((course) => course.id === item.courseId)?.title ?? item.courseId,
    title: item.title,
    summary: item.oneLineSummary,
    simpleExplanation: item.oneLineSummary,
    analogy: item.moneyFlowPosition,
    detailedExplanation: `${item.whyItMatters} ${item.currentMarketConnection} 다만 하나의 지표나 뉴스만으로 시장 방향을 확정하지는 않습니다.`,
    whyItMatters: item.whyItMatters,
    examples: [
      { title: "돈의 흐름에서 위치", description: item.moneyFlowPosition },
      { title: "현재 시장 연결", description: item.currentMarketConnection },
      { title: "AI Mentor 질문", description: item.aiMentorQuestions.join(" / ") },
    ],
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

function lesson(input: LessonInput): UniversityLesson {
  return {
    ...input,
    relatedNewsTags: input.relatedNews,
    quiz: [
      {
        question: `${input.title}를 볼 때 가장 안전한 태도는 무엇일까요?`,
        options: ["근거와 한계를 함께 본다", "가격 방향을 바로 확정한다", "데이터가 없으면 0으로 본다", "뉴스 하나만 믿는다"],
        answerIndex: 0,
        explanation: "학습 시스템은 연결된 지표, 뉴스, 용어, 한계를 함께 보도록 설계되어 있습니다.",
      },
    ],
  };
}
